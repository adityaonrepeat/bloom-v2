import { io } from "socket.io-client"

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:4000"

export const socket = io(SOCKET_URL, {
  transports: ["websocket"],
  autoConnect: false
})

// Prevent multiple connects
let isConnecting = false

export function ensureSocketConnected() {
  if (!socket.connected && !isConnecting) {
    isConnecting = true
    socket.connect()

    socket.on("connect", () => {
      isConnecting = false
      console.log("✅ Socket connected:", socket.id)
    })

    socket.on("disconnect", () => {
      console.log("❌ Socket disconnected")
      isConnecting = false
    })
  }
}