# Realtime Matching System Flow

This document explains the step-by-step flow of the Bloom realtime matching system, moving from the frontend pages to the backend managers, addressing Redis queues, socket logic, and cooldown mechanics.

---

## 1. The Starting Point: `match/page.tsx`
When a user wants to talk, they land on the Match page. Here is what happens:
- The user's previously selected emotion is retrieved from `localStorage.getItem("emotion-tag")`.
- We connect to the Socket.io server using `socket.connect()`.
- We emit a `join-queue` event, sending our emotion to the server:
  ```typescript
  socket.emit("join-queue", { emotion })
  ```
- Two listeners are set up: 
  - `waiting`: if no match is immediately found, we show the pulsing UI.
  - `match-found`: if a match happens, we are redirected to `/talk?room=roomId`.

---

## 2. Server Entry: `index.ts` (Realtime Entry Point)
On the Node server, `index.ts` is listening for users connecting and sending `join-queue`:

```typescript
socket.on("join-queue", async ({ emotion }: { emotion: string }) => {
  userEmotions.set(socket.id, emotion) // Track what queue they are in

  // Try to find an immediate match
  const partner = await MatchManager.findMatch(socket.id, emotion)

  if (partner) {
    // Found someone! Create a literal Socket.IO room for them to chat in.
    RoomManager.createRoom(io, socket.id, partner)
    userEmotions.delete(partner)
    userEmotions.delete(socket.id)
  } else {
    // No one available. Put this user in the Redis queue!
    await MatchManager.addToQueue(socket.id, emotion)
    socket.emit("waiting")
  }
})
```

---

## 3. Finding Compatibility: `emotionGraph.ts`
Before we just match anyone with anyone, we consult `emotionGraph.ts`. 
If you are `happy`, your priority matches are `["happy", "calm"]`. If you are `anxious`, your priorities are `["anxious", "stressed"]`. 

---

## 4. The Redis Queue Engine: `matchManager.ts`
This is where Redis queue magic happens. 
When we try to find a match, `MatchManager.findMatch(socketId, emotion)` iterates over the priority emotions first:
```typescript
for (const targetEmotion of priorities) {
  const partner = await this.popPartner(`queue:${targetEmotion}`, socketId)
  if (partner) return partner // Match found!
}
```
If priority queues are empty, it checks all other remaining queues.

### "Multiple queues and how they don't cause problems"
You asked how the system avoids issues if a user enters multiple queues. 
- Technically, a user is only inserted into **one** queue at a time based on the `targetEmotion`. 
- When an exact match is made, `popPartner` uses `redis.rpop(queue)`. RPOP is an **atomic operation**. If two people try to pop from the queue at the exact same millisecond, Redis guarantees one will get the partner, and the other will get `null`. This prevents race conditions.
- Inside `popPartner()`, there's a check `if (candidate !== selfId) return candidate`. This is a fail-safe so you don't accidentally match with yourself!

---

## 5. Room Creation: `roomManager.ts`
When `MatchManager` finds a pair, `RoomManager.createRoom(io, user1, user2)` is called.
- It generates a unique `roomId` (e.g., `room_171234_xyza`).
- It extracts the `socket` objects for both users inside the Socket.io structure. (You asked about `io.sockets.sockets.get(user)`: in socket.io v4, `.sockets.sockets` is a Map containing all active web-socket objects connected to the server by their ID).
- Both sockets are forced to join this private room: `socket1.join(roomId)`.
- Memory variables `rooms` and `userRooms` save who is in which room for quick lookups.
- Finally, it pings the users: `socket.emit("match-found", { roomId, partnerId: user2 })`.

---

## 6. Video Interface: `talk/page.tsx`
Back on the frontend, users are redirected to `/talk?room=roomId`. 
- The React page loads ZegoCloud `ZegoUIKitPrebuilt`.
- ZegoCloud uses the **same `roomId`** given by our Socket server to initiate the WebRTC video stream.
- ZegoCloud handles the actual P2P video data, while our custom Socket room handles lightweight text messages and skipped events.

### The Cooldown and First Skip Logic
When a user clicks "Next Person", they trigger:
```typescript
socket.emit("skip", { emotion })
```

In `index.ts`:
```typescript
const canSkip = await MatchManager.canSkip(socket.id)
```
- **1st Skip is OK:** `canSkip` checks Redis for `skip-cooldown:socketId`. Because they haven't skipped yet, Redis returns null. `canSkip` equals **true**.
- They leave the room (pinging the partner that they left), and re-enter the matchmaking queue immediately.
- We then call `MatchManager.setSkipCooldown(socket.id)`, which creates a Redis key `skip-cooldown:socketId` that automatically deletes itself after 10 seconds (using `{ ex: 10 }`).
- **Rapid Skip blocked:** If they quickly skip again, `canSkip` finds the key in Redis and returns **false**. The server refuses to run the skip logic and instead emits `skip-cooldown` to the frontend.
- `talk/page.tsx` catches this event and updates `setSkipCooldown(seconds)`, visually disabling the "Next Person" button and showing a countdown timer.
