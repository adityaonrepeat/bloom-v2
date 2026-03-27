import express from "express"
import { createServer } from "http"
import { Server } from "socket.io"
import cors from "cors"
import dotenv from "dotenv"
import { MatchManager } from "./managers/matchManager.js"
import { RoomManager } from "./managers/roomManager.js"

dotenv.config()

const app = express()
app.use(cors())

const httpServer = createServer(app)

const io = new Server(httpServer, {
  cors: { origin: "*" }
})

// Track socketId → emotion
const userEmotions = new Map<string, string>()
// Track socketId → DB userId (for reports)
const userDbIds = new Map<string, string>()
// Track last partner per socket with timestamp (5s cooldown, then re-matchable)
const lastPartnerMap = new Map<string, { partnerId: string; time: number }>()

io.on("connection", (socket) => {
  console.log("User connected:", socket.id)

  socket.on("join-queue", async ({ emotion, userId }: { emotion: string; userId?: string }) => {
    console.log(`[join-queue] ${socket.id} → ${emotion}`)

    if (RoomManager.isInRoom(socket.id)) return

    userEmotions.set(socket.id, emotion)
    if (userId) userDbIds.set(socket.id, userId)

    const avoidId = lastPartnerMap.get(socket.id)
    const avoidPartner = avoidId && (Date.now() - avoidId.time < 5000) ? avoidId.partnerId : undefined
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
      await MatchManager.processQueues(io, userDbIds, lastPartnerMap)
    } catch (e) {
      console.error("[join-queue] processQueues failed:", e)
    }
  })

  socket.on("skip", async ({ emotion }: { emotion: string }) => {
    const canSkip = await MatchManager.canSkip(socket.id)
    if (!canSkip) {
      socket.emit("skip-cooldown", { seconds: 6 })
      return
    }

    console.log(`[skip] ${socket.id} skipping partner`)

    // leaveRoom returns the partner's socket ID
    const partnerId = RoomManager.leaveRoom(io, socket.id)

    await MatchManager.setSkipCooldown(socket.id)

    // Requeue the SKIPPER
    userEmotions.set(socket.id, emotion)
    await MatchManager.addToQueue(socket.id, emotion)
    socket.emit("waiting")
    console.log(`[requeue] ${socket.id} back in ${emotion} queue (skipper)`)

    // Requeue the PARTNER — they were left stranded with no queue entry
    if (partnerId) {
      const partnerEmotion = userEmotions.get(partnerId) || emotion
      userEmotions.set(partnerId, partnerEmotion)
      await MatchManager.addToQueue(partnerId, partnerEmotion)
      const partnerSocket = io.sockets.sockets.get(partnerId)
      if (partnerSocket) {
        partnerSocket.emit("waiting")
        console.log(`[requeue] ${partnerId} back in ${partnerEmotion} queue (skipped partner)`)
      }
    }

    // Delay so both lpush calls are committed to Redis before we scan
    setTimeout(async () => {
      try {
        await MatchManager.processQueues(io, userDbIds, lastPartnerMap)
      } catch (e) {
        console.error("[skip] processQueues failed:", e)
      }
    }, 50)
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
      await MatchManager.processQueues(io, userDbIds, lastPartnerMap)
    } catch (e) {
      console.error("[disconnect] processQueues failed:", e)
    }
  })
})

app.get("/health", (_req, res) => res.json({ status: "ok" }))

const PORT = process.env.PORT || 4000
httpServer.listen(PORT, () => console.log(`Realtime server running on ${PORT}`))