import { Server } from "socket.io"
import { randomUUID } from "crypto"

const rooms = new Map<string, string[]>()

const userRooms = new Map<string, string>()

export class RoomManager {

  static createRoom(io: Server, user1: string, user2: string, userDbIds: Map<string, string>): string | null {

    const roomId = randomUUID()

    const socket1 = io.sockets.sockets.get(user1)
    const socket2 = io.sockets.sockets.get(user2)

    if (!socket1 || !socket2) return null

    socket1.join(roomId)
    socket2.join(roomId)

    rooms.set(roomId, [user1, user2])
    userRooms.set(user1, roomId)
    userRooms.set(user2, roomId)

    const partnerIdForUser1 = userDbIds.get(user2) || user2
    const partnerIdForUser2 = userDbIds.get(user1) || user1

    socket1.emit("match-found", { roomId, partnerId: partnerIdForUser1 })
    socket2.emit("match-found", { roomId, partnerId: partnerIdForUser2 })

    console.log(`[room-created] ${roomId} → ${user1} + ${user2}`)

    return roomId
  }

  static leaveRoom(io: Server, socketId: string): string | null {

    const roomId = userRooms.get(socketId)
    if (!roomId) return null

    const members = rooms.get(roomId) || []
    const partnerId = members.find(id => id !== socketId)

    if (partnerId) {
      const partnerSocket = io.sockets.sockets.get(partnerId)
      if (partnerSocket) {
        partnerSocket.emit("partner-left") 
        partnerSocket.leave(roomId)
      }
      userRooms.delete(partnerId)
    }

    const socket = io.sockets.sockets.get(socketId)
    if (socket) socket.leave(roomId)

    userRooms.delete(socketId)
    rooms.delete(roomId)

    return partnerId || null
  }

  static getPartner(socketId: string): string | null {
    const roomId = userRooms.get(socketId)
    if (!roomId) return null
    const members = rooms.get(roomId) || []
    return members.find(id => id !== socketId) || null
  }

  static getUserRoom(socketId: string): string | null {
    return userRooms.get(socketId) || null
  }

  static isInRoom(socketId: string): boolean {
    return userRooms.has(socketId)
  }
}