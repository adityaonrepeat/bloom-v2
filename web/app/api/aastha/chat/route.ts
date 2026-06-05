import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { headers } from "next/headers"
import { NextRequest } from "next/server"
import { GoogleGenAI } from "@google/genai"
import { checkRateLimit, chatBurstLimiter, chatDailyLimiter } from "@/lib/ratelimit"

// Initialize GenAI dynamically to avoid Next.js caching issues with env variables
// we initialize it inside the POST handler now.
const SYSTEM_PROMPT = `You are Aastha, a compassionate and warm AI therapist on the Bloom mental wellness platform.

Your core qualities:
- Empathetic, non-judgmental, and supportive
- You practice evidence-based therapeutic approaches (CBT, mindfulness, person-centered therapy)
- You listen deeply and reflect back what you hear
- You ask thoughtful, open-ended questions to help users explore their feelings
- You validate emotions before offering any suggestions
- You speak in a warm, conversational tone — never clinical or robotic
- You remember the emotional context of this session and reference it naturally

Important guidelines:
- NEVER diagnose mental health conditions
- NEVER prescribe medications or make medical recommendations
- For crisis situations (self-harm, suicide), gently encourage professional help and provide crisis resources (iCall: 9152987821)
- Keep responses concise and focused — usually 2-4 paragraphs max
- Use the user's name when you know it for a personal touch
- Honor the user's current emotional state in how you respond
- You may use **bold** for emphasis and bullet points sparingly when listing coping strategies`

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 })
  }

  // Throttle before any DB work or the (paid) Gemini call. The message is
  // phrased in Aastha's voice so useStreamingChat surfaces it as a chat bubble.
  const limited = await checkRateLimit(
    [chatBurstLimiter, chatDailyLimiter],
    session.user.id,
    "I'm sorry, you're sending messages faster than I can thoughtfully respond. Take a breath and try again in a few seconds.",
  )
  if (limited) return limited

  const body = await req.json()
  const { sessionId, message } = body

  if (!sessionId || !message) {
    return new Response(JSON.stringify({ error: "sessionId and message are required" }), {
      status: 400,
    })
  }

  // Verify ownership
  const aasthaSession = await prisma.aasthaSession.findFirst({
    where: { id: sessionId, userId: session.user.id },
  })
  if (!aasthaSession) {
    return new Response(JSON.stringify({ error: "Session not found" }), { status: 404 })
  }

  // User context
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, emotionalTag: true, emotionalScore: true },
  })

  // Save user message first
  await prisma.aasthaMessage.create({
    data: { sessionId, role: "user", content: message },
  })

  // Fetch last 10 messages for context
  const recentMessages = await prisma.aasthaMessage.findMany({
    where: { sessionId },
    orderBy: { createdAt: "asc" },
    take: -11,
  })

  const moodContext = aasthaSession.emotionTag
    ? `The user ${user?.name ?? "this person"} is currently feeling ${aasthaSession.emotionTag}${
        aasthaSession.emotionScore
          ? ` with an emotional intensity score of ${aasthaSession.emotionScore}/100`
          : ""
      }. Keep this emotional state in mind throughout the conversation.`
    : ""

  const conversationHistory = recentMessages
    .slice(0, -1)
    .map((m) => `${m.role === "user" ? "User" : "Aastha"}: ${m.content}`)
    .join("\n")

  const fullPrompt = `${SYSTEM_PROMPT}

${moodContext}

Previous conversation:
${conversationHistory || "(This is the start of the conversation)"}

User: ${message}

Aastha:`

  const encoder = new TextEncoder()
  let fullAiText = ""

  const stream = new ReadableStream({
    async start(controller) {
      try {
        let result
        let attempt = 0
        const maxAttempts = 2

        while (attempt < maxAttempts) {
          try {
            const genai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! })
            result = await genai.models.generateContentStream({
              model: "gemini-2.5-flash",
              contents: fullPrompt,
            })
            break // Success, exit retry loop
          } catch (e: any) {
            attempt++
            if (attempt >= maxAttempts || e?.status !== 503) {
              throw e // Rethrow if max attempts reached or not a 503
            }
            // Wait 1 second before retrying
            await new Promise((resolve) => setTimeout(resolve, 1000))
          }
        }

        // We know result is defined here if it didn't throw
        for await (const chunk of result!) {
          const text = chunk.text ?? ""
          if (text) {
            fullAiText += text
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ token: text })}\n\n`))
          }
        }

        // Persist the full AI response
        const aiMessage = await prisma.aasthaMessage.create({
          data: { sessionId, role: "assistant", content: fullAiText.trim() },
        })

        // Auto-title on first exchange
        const messageCount = await prisma.aasthaMessage.count({ where: { sessionId } })
        if (messageCount <= 3 && aasthaSession.title === "New Session") {
          const titleHint = message.slice(0, 60).replace(/\n/g, " ")
          await prisma.aasthaSession.update({
            where: { id: sessionId },
            data: {
              title: titleHint.length < message.length ? `${titleHint}…` : titleHint,
              updatedAt: new Date(),
            },
          })
        } else {
          await prisma.aasthaSession.update({
            where: { id: sessionId },
            data: { updatedAt: new Date() },
          })
        }

        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ done: true, message: aiMessage })}\n\n`)
        )
        controller.close()
      } catch (err) {
        console.error("Gemini stream error:", err)
        const errorMsg = "I'm sorry, something on my side isn't working right now. But you're not alone — feel free to keep sharing, and I'll be back with you shortly."
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ error: errorMsg })}\n\n`)
        )
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  })
}
