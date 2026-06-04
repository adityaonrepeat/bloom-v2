import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { NextResponse } from "next/server"
import { generateToken04 } from "@/lib/zegoToken"

// Issues a short-lived Zego token signed with the ServerSecret. The secret
// stays server-side; the browser only ever sees the resulting token. The Zego
// user id is derived from the session, not trusted from the client.
export async function POST() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const appID = Number(process.env.NEXT_PUBLIC_ZEGO_APP_ID)
  const serverSecret = process.env.ZEGO_SERVER_SECRET

  if (!appID || !serverSecret) {
    return NextResponse.json({ error: "Zego is not configured" }, { status: 500 })
  }

  const userId = session.user.id
  const token = generateToken04(appID, userId, serverSecret, 3600) // 1 hour

  return NextResponse.json({ token, userId })
}
