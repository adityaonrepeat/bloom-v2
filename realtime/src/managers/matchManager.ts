import { redis } from "../redis/redis.js"

const ALL_EMOTIONS = ["happy", "calm", "stressed", "anxious"]
const SKIP_COOLDOWN_SECONDS = 6

export class MatchManager {

  static async findMatch(socketId: string, emotion: string, avoidId?: string): Promise<string | null> {
  
    const partner = await this.popPartner(`queue:${emotion}`, socketId, avoidId)
    if (partner) return partner

    for (const e of ALL_EMOTIONS) {
      if (e === emotion) continue
      const otherPartner = await this.popPartner(`queue:${e}`, socketId, avoidId)
      if (otherPartner) return otherPartner
    }

    return null
  }

  private static async popPartner(queue: string, selfId: string, avoidId?: string): Promise<string | null> {
    const MAX_ATTEMPTS = 10
    const skipped: string[] = []
    let match: string | null = null

    for (let i = 0; i < MAX_ATTEMPTS; i++) {
      const candidate = await redis.rpop(queue) as string | null
      if (!candidate) break
      
      if (candidate !== selfId && candidate !== avoidId) {
        match = candidate
        break
      }
      
      skipped.push(candidate)
    }

    for (const s of skipped) {
      await redis.lpush(queue, s)
    }

    return match
  }

  static async addToQueue(socketId: string, emotion: string): Promise<void> {
    await redis.lrem(`queue:${emotion}`, 0, socketId)
    await redis.lpush(`queue:${emotion}`, socketId)
  }

  static async removeFromQueue(socketId: string, emotion: string): Promise<void> {
    await redis.lrem(`queue:${emotion}`, 0, socketId)
  }

  static async canSkip(socketId: string): Promise<boolean> {
    const cooldown = await redis.get(`skip-cooldown:${socketId}`)
    return !cooldown
  }

  static async setSkipCooldown(socketId: string): Promise<void> {
    await redis.set(`skip-cooldown:${socketId}`, "1", { ex: SKIP_COOLDOWN_SECONDS })
  }

  static async processQueues(io: any, userDbIds: Map<string, string>, lastPartnerMap: Map<string, { partnerId: string; time: number }>): Promise<void> {
    const RoomManager = (await import("./roomManager.js")).RoomManager
    const COOLDOWN_MS = 5000

    for (const emotion of ALL_EMOTIONS) {
      while (true) {
        const user1 = await redis.rpop(`queue:${emotion}`) as string | null
        if (!user1) break

        if (RoomManager.isInRoom(user1) || !io.sockets.sockets.has(user1)) {
          console.log(`[processQueue] Discarding ghost ${user1}`)
          continue
        }

        const lastEntry = lastPartnerMap.get(user1)
        const avoidId = lastEntry && (Date.now() - lastEntry.time < COOLDOWN_MS) ? lastEntry.partnerId : undefined
        const user2 = await this.findMatch(user1, emotion, avoidId)

        if (!user2) {
          await redis.lpush(`queue:${emotion}`, user1)
          break
        }

        if (!io.sockets.sockets.has(user2) || RoomManager.isInRoom(user2)) {
          console.log(`[processQueue] user2 ${user2} is gone/busy, putting user1 back`)
          await redis.lpush(`queue:${emotion}`, user1)
          continue
        }

        const room = RoomManager.createRoom(io, user1, user2, userDbIds)
        if (!room) {
          console.log(`[processQueue] createRoom failed, requeueing user1`)
          await redis.lpush(`queue:${emotion}`, user1)
          continue
        }

        lastPartnerMap.set(user1, { partnerId: user2, time: Date.now() })
        lastPartnerMap.set(user2, { partnerId: user1, time: Date.now() })
        console.log(`[matched via processQueue] ${user1} ↔ ${user2}`)
      }
    }
  }
}