# Bloom — Architecture

This document explains how Bloom is put together: the two‑service design, how the major features work end‑to‑end, the data model, and the key trade‑offs.

For setup and scripts, see the [root README](README.md).

---

## 1. Two‑service design

Bloom is split into two **independent processes** that deploy and scale separately:

| Service | Directory | Port | Responsibility |
|---------|-----------|------|----------------|
| Web app | `web/` | 3000 | UI, auth, AI chat, journals, quiz, REST API |
| Realtime server | `realtime/` | 4000 | Socket.IO matchmaking for peer video |

They share **no code**. The only things that cross the boundary are:

1. The browser's Socket.IO client (`web/lib/socket.ts`) connecting to the realtime server.
2. **User IDs** from Bloom's PostgreSQL database — the realtime server has no database of its own; the client tells it the user's DB id on `join-queue`.

```
                 Browser
        ┌────────────────────────┐
        │  Next.js client + UI   │
        └───────┬────────────┬───┘
       HTTP/SSE │            │ WebSocket (Socket.IO)
                ▼            ▼
   ┌──────────────────┐  ┌─────────────────────────┐
   │ web/ (Next.js)   │  │ realtime/ (Socket.IO)   │
   │  API routes      │  │  match + room managers  │
   └────────┬─────────┘  └───────────┬─────────────┘
            │                        │
            ▼                        ▼
      PostgreSQL (Prisma)      Upstash Redis
```

**Why two services?** Video matchmaking is stateful, latency‑sensitive, and connection‑oriented (WebSockets), which is a poor fit for serverless Next.js route handlers. Isolating it keeps the web app stateless and easy to deploy, while the realtime server owns the queueing logic.

---

## 2. Authentication

Built on [**better-auth**](https://www.better-auth.com).

- **Server config** — `web/lib/auth.ts`: `betterAuth` with the Prisma/PostgreSQL adapter, email/password + Google OAuth, and [Resend](https://resend.com) for transactional email (verification, etc.).
- **Client helper** — `web/lib/auth-client.ts`: `createAuthClient`; exports `authClient`, `signIn`, `signUp`, `signOut`, `useSession`.
- **Server actions** — `web/server/auth-actions.ts`: `registerEmail`, `loginEmail`, `signOut`, consumed by form components via `useActionState`.
- **Route protection** — `web/proxy.ts`: middleware that validates the real session (not just cookie presence) to guard `/dashboard`, `/aastha`, `/talk`, `/journal`, `/quiz`, `/result`.

Blocked users (see [Safety](#7-safety--moderation)) are restricted from the Talk feature specifically rather than the whole app.

---

## 3. Data model

Prisma schema lives at `web/prisma/schema.prisma`; the client is generated to `web/lib/generated/prisma` and imported app‑wide via `@/lib/prisma`.

| Model | Purpose | Notable fields |
|-------|---------|----------------|
| `User` | Account + emotional state | `emotionalScore`, `emotionalTag`, `isBlocked`, `reportCount` |
| `Session` / `Account` / `Verification` | better-auth tables | sessions, OAuth accounts, email verification |
| `MoodLog` | Daily mood snapshot | `emotionTag`, `emotionScore` (0–50), optional `note` |
| `Journal` | Free‑text journal entry | `title`, `content` |
| `AasthaSession` | An AI therapy conversation | `title` (auto‑generated), emotion snapshot |
| `AasthaMessage` | One message in a session | `role` (`user`/`assistant`), `content` |
| `Report` | Peer report from a Talk session | `reporterId`, `reportedId` |

`EmotionTag` is an enum: `happy` · `calm` · `stressed` · `anxious`.

---

## 4. Quiz & emotion system

The emotion tag is the connective tissue between features — it personalizes the AI and drives video matchmaking.

1. A 10‑question quiz stores progress in `localStorage` (`quiz-index`, `quiz-score`).
2. The final score (0–50) maps to an `EmotionTag` in `web/utils/emotion.ts`:

   | Score | Tag |
   |-------|-----|
   | ≥ 42 | `happy` |
   | ≥ 31 | `calm` |
   | ≥ 20 | `stressed` |
   | else | `anxious` |

3. The `/result` page calls `POST /api/user/set-score` (persists to the DB) **and** writes `localStorage("emotion-tag")`, which the realtime matchmaking reads later.

---

## 5. Aastha — the AI therapist

A streaming chat companion built on **Gemini 2.5 Flash** (`@google/genai`).

**Flow:**
1. The client uses the `useStreamingChat` hook (`web/hooks/useStreamingChat.ts`).
2. It POSTs to `/api/aastha/chat`, which verifies the session, loads the last 10 messages, and builds a prompt grounded in the user's current emotional state.
3. The route streams **Server‑Sent Events**: `data: {"token": "..."}` per token, closing with `data: {"done": true, "message": {...}}`.
4. The TanStack Query cache (`keys.messages(sessionId)`) is updated optimistically on send and committed on `done`.
5. A session is auto‑titled from the first ~60 characters of the user's opening message.

---

## 6. Talk — peer video matchmaking

The most involved feature. It spans the browser, the realtime server, Redis, and ZegoCloud.

### End‑to‑end flow
1. User finishes the quiz → emotion is in `localStorage("emotion-tag")`.
2. `/talk` (`web/app/talk/page.tsx`) opens a Socket.IO connection and emits `join-queue` with `{ emotion, userId }`.
3. On `match-found`, both clients receive a shared `roomId` and **each other's DB user id**.
4. The ZegoCloud UIKit Prebuilt renders the video room from `roomId`.
5. **Skip:** the server requeues both parties atomically (`Promise.all`) and delays `processQueues` by ~300 ms so Zego can tear down cleanly.
6. **Report:** the web app calls `POST /api/user/report` with the partner's DB user id captured at match time.

### Realtime server state

**In memory (per process):**
- `userEmotions` — `socketId → emotion`
- `userDbIds` — `socketId → Postgres user id`
- `lastPartnerMap` — `socketId → { partnerId, time }` for a 4 s rematch cooldown

**In Upstash Redis:**
- `queue:{emotion}` lists — waiting socket ids per emotion
- `skip-cooldown:{socketId}` keys — TTL‑based 3 s skip rate limiting

### Socket events

| Direction | Event | Payload |
|-----------|-------|---------|
| client → server | `join-queue` | `{ emotion, userId }` |
| client → server | `skip` | `{ emotion, userId }` |
| server → client | `waiting` | — |
| server → client | `match-found` | `{ roomId, partnerId }` (`partnerId` is the DB user id) |
| server → client | `partner-left` | — |
| server → client | `skip-cooldown` | `{ seconds }` |

### Matching logic — `realtime/src/managers/matchManager.ts`
1. Try the same‑emotion queue first, then cross‑emotion queues.
2. `rpop` candidates; skip self and the last partner (rematch cooldown); push skipped candidates back with `lpush`.
3. `processQueues()` runs after every `join-queue`, `skip`, and `disconnect` to continuously drain the queues.

### Room management — `realtime/src/managers/roomManager.ts`
- Two in‑memory maps: `rooms` (`roomId → [socketId, socketId]`) and `userRooms` (`socketId → roomId`).
- `createRoom` emits `match-found` to both sockets carrying the **other user's DB id** (not the socket id), which is what lets the web app file a report.
- `leaveRoom` emits `partner-left` to the remaining socket and cleans both maps.

> **Why DB ids, not socket ids?** Socket ids are ephemeral and meaningless to the database. Passing the DB user id at match time is what makes post‑session reporting possible without the realtime server needing DB access.

---

## 7. Safety & moderation

- **Reporting:** `POST /api/user/report` increments the reported user's `reportCount` and auto‑sets `isBlocked` once it crosses a threshold.
- **Blocking:** blocked users are restricted from Talk (peer video) specifically.
- **Email verification:** unverified users are routed to a verify‑email page.
- **Token security:** ZegoCloud tokens are signed **server‑side**, and the realtime CORS policy is locked to the web origin.

---

## 8. API surface (web)

All under `web/app/api/`:

| Route | Purpose |
|-------|---------|
| `POST /api/mood` | Log daily mood, update the user's current emotional state |
| `GET\|POST /api/journal` | List / create journal entries |
| `GET\|PUT\|DELETE /api/journal/[id]` | Single journal CRUD |
| `POST /api/aastha/chat` | Gemini SSE streaming chat |
| `GET\|POST /api/aastha/sessions` | List / create Aastha sessions |
| `GET /api/aastha/messages` | Fetch messages for a session |
| `POST /api/user/set-score` | Persist quiz result to the user profile |
| `POST /api/user/report` | Submit a peer report (auto‑blocks at threshold) |

---

## 9. Key trade‑offs

- **Matchmaking state is in‑memory + Redis, not the main DB.** This keeps matching fast and the web app stateless, at the cost of the realtime server being a single point of state per process. Redis holds the durable queue/cooldown state so matching survives a client reconnect.
- **Emotion is cached in `localStorage`.** It avoids a DB round‑trip before joining the queue, but means the tag can drift from the DB if the user clears storage — the DB remains the source of truth.
- **AI responses stream over SSE rather than WebSockets.** SSE is simpler for one‑way token streaming and works cleanly with Next.js route handlers, keeping the web app free of long‑lived socket connections.
