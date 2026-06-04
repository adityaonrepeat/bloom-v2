import express from "express"
import { createServer } from "http"
import { Server } from "socket.io"
import cors from "cors"
import dotenv from "dotenv"
import { MatchManager } from "./managers/matchManager.js"
import { RoomManager } from "./managers/roomManager.js"

dotenv.config()

const app = express()

// Lock CORS to the web origin(s). Set CORS_ORIGIN on the host to your deployed
// web domain (comma-separated for multiple). Defaults to localhost for dev.
const allowedOrigins = (process.env.CORS_ORIGIN ?? "http://localhost:3000")
  .split(",")
  .map((o) => o.trim())

app.use(cors({ origin: allowedOrigins }))

const httpServer = createServer(app)

const io = new Server(httpServer, {
  cors: { origin: allowedOrigins, methods: ["GET", "POST"] }
})

// Track socketId → emotion
const userEmotions = new Map<string, string>()
// Track socketId → DB userId (for reports)
const userDbIds = new Map<string, string>()
// Track last partner per socket with timestamp — must stay in sync with processQueues
const lastPartnerMap = new Map<string, { partnerId: string; time: number }>()
const REMATCH_COOLDOWN_MS = 4000 // always > SKIP_COOLDOWN_SECONDS (3s) to close the gap window

io.on("connection", (socket) => {
  console.log("User connected:", socket.id)

  socket.on("join-queue", async ({ emotion, userId }: { emotion: string; userId?: string }) => {
    console.log(`[join-queue] ${socket.id} → ${emotion}`)

    if (RoomManager.isInRoom(socket.id)) return

    userEmotions.set(socket.id, emotion)
    if (userId) userDbIds.set(socket.id, userId)

    const avoidId = lastPartnerMap.get(socket.id)
    const avoidPartner = avoidId && (Date.now() - avoidId.time < REMATCH_COOLDOWN_MS) ? avoidId.partnerId : undefined
    const partner = await MatchManager.findMatch(socket.id, emotion, avoidPartner)

    if (partner && io.sockets.sockets.has(partner)) {
      const room = RoomManager.createRoom(io, socket.id, partner, userDbIds)
      if (room) {
        lastPartnerMap.set(socket.id, { partnerId: partner, time: Date.now() })
        lastPartnerMap.set(partner, { partnerId: socket.id, time: Date.now() })
        userEmotions.delete(partner)
        userEmotions.delete(socket.id)
        console.log(`[matched] ${socket.id} ↔ ${partner}`)
        return
      }
    }

    await MatchManager.addToQueue(socket.id, emotion)
    socket.emit("waiting")
    console.log(`[waiting] ${socket.id} queued in ${emotion}`)

    // Trigger matching in case another user is already waiting
    try {
      await MatchManager.processQueues(io, userDbIds, lastPartnerMap, REMATCH_COOLDOWN_MS)
    } catch (e) {
      console.error("[join-queue] processQueues failed:", e)
    }
  })

  socket.on("skip", async ({ emotion }: { emotion: string }) => {
    const canSkip = await MatchManager.canSkip(socket.id)
    if (!canSkip) {
      socket.emit("skip-cooldown", { seconds: 3 })
      return
    }

    console.log(`[skip] ${socket.id} skipping partner`)

    // leaveRoom returns the partner's socket ID
    const partnerId = RoomManager.leaveRoom(io, socket.id)

    await MatchManager.setSkipCooldown(socket.id)

    // Refresh lastPartnerMap NOW (at skip-time) so the 7s cooldown window
    // starts from this moment, not from when the original match was created.
    if (partnerId) {
      const now = Date.now()
      lastPartnerMap.set(socket.id, { partnerId, time: now })
      lastPartnerMap.set(partnerId, { partnerId: socket.id, time: now })
    }

    // Requeue BOTH parties atomically — Promise.all guarantees both lpush calls
    // are committed to Redis before processQueues ever reads the queues.
    const partnerEmotion = (partnerId && userEmotions.get(partnerId)) || emotion

    if (partnerId) {
      userEmotions.set(partnerId, partnerEmotion)
    }
    userEmotions.set(socket.id, emotion)

    await Promise.all([
      MatchManager.addToQueue(socket.id, emotion),
      partnerId ? MatchManager.addToQueue(partnerId, partnerEmotion) : Promise.resolve(),
    ])

    // Notify both clients they're back in the queue
    socket.emit("waiting")
    console.log(`[requeue] ${socket.id} back in ${emotion} queue (skipper)`)

    if (partnerId) {
      const partnerSocket = io.sockets.sockets.get(partnerId)
      if (partnerSocket) {
        partnerSocket.emit("waiting")
        console.log(`[requeue] ${partnerId} back in ${partnerEmotion} queue (skipped partner)`)
      }
    }

    // Delay rematch by 300ms — gives Zego time to fully destroy the old room
    // on both clients before a new match-found fires, preventing SDK overlap crashes.
    setTimeout(async () => {
      try {
        await MatchManager.processQueues(io, userDbIds, lastPartnerMap, REMATCH_COOLDOWN_MS)
      } catch (e) {
        console.error("[skip] processQueues failed:", e)
      }
    }, 300)
  })

  socket.on("disconnect", async () => {
    console.log("User disconnected:", socket.id)

    RoomManager.leaveRoom(io, socket.id)

    // Clean from ALL queues to eliminate ghost entries regardless of tracked emotion
    await MatchManager.removeFromAllQueues(socket.id)
    userEmotions.delete(socket.id)

    userDbIds.delete(socket.id)
    lastPartnerMap.delete(socket.id)

    try {
      await MatchManager.processQueues(io, userDbIds, lastPartnerMap, REMATCH_COOLDOWN_MS)
    } catch (e) {
      console.error("[disconnect] processQueues failed:", e)
    }
  })
})

app.get("/health", (_req, res) => res.json({ status: "ok" }))

const PORT = process.env.PORT || 4000
httpServer.listen(PORT, () => console.log(`Realtime server running on ${PORT}`))