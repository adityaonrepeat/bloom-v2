import { useCallback, useState } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { keys, type AasthaMessage } from "./useAastha"

interface UseStreamingChatOptions {
  sessionId: string
}

interface StreamingState {
  streamingContent: string
  isStreaming: boolean
  error: string | null
}

export function useStreamingChat({ sessionId }: UseStreamingChatOptions) {
  const qc = useQueryClient()
  const [state, setState] = useState<StreamingState>({
    streamingContent: "",
    isStreaming: false,
    error: null,
  })

  const sendMessage = useCallback(
    async (message: string) => {
      if (!message.trim() || state.isStreaming) return

      // ── 1. Optimistic user message ─────────────────────────────────────────
      const optimisticUserMsg: AasthaMessage = {
        id: `optimistic-${Date.now()}`,
        role: "user",
        content: message.trim(),
        createdAt: new Date().toISOString(),
      }

      qc.setQueryData<{ messages: AasthaMessage[]; sessionMeta: any }>(
        keys.messages(sessionId),
        (prev) => {
          if (!prev) return prev
          return { ...prev, messages: [...prev.messages, optimisticUserMsg] }
        }
      )

      setState({ streamingContent: "", isStreaming: true, error: null })

      try {
        const res = await fetch("/api/aastha/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId, message: message.trim() }),
        })

        if (!res.ok) {
          const err = await res.json()
          throw new Error(err.error || "Failed to send message")
        }

        // ── 2. Read SSE stream ───────────────────────────────────────────────
        const reader = res.body!.getReader()
        const decoder = new TextDecoder()
        let accumulated = ""

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value, { stream: true })
          const lines = chunk.split("\n").filter((l) => l.startsWith("data: "))

          for (const line of lines) {
            try {
              const payload = JSON.parse(line.slice(6))

              if (payload.error) throw new Error(payload.error)

              if (payload.token) {
                accumulated += payload.token
                setState((s) => ({ ...s, streamingContent: accumulated }))
              }

              if (payload.done && payload.message) {
                // ── 3. Commit final messages to cache ──────────────────────
                qc.setQueryData<{ messages: AasthaMessage[]; sessionMeta: any }>(
                  keys.messages(sessionId),
                  (prev) => {
                    if (!prev) return prev
                    const withoutOptimistic = prev.messages.filter(
                      (m) => m.id !== optimisticUserMsg.id
                    )
                    const confirmedUser: AasthaMessage = {
                      ...optimisticUserMsg,
                      id: `user-${Date.now()}`,
                    }
                    return {
                      ...prev,
                      messages: [...withoutOptimistic, confirmedUser, payload.message],
                    }
                  }
                )

                // ── 4. Refetch sessions list (title may have auto-updated) ─
                qc.invalidateQueries({ queryKey: keys.sessions })
              }
            } catch {
              // Malformed SSE line — skip
            }
          }
        }
      } catch (err: any) {
        // Roll back optimistic message
        qc.setQueryData<{ messages: AasthaMessage[]; sessionMeta: any }>(
          keys.messages(sessionId),
          (prev) => {
            if (!prev) return prev
            return {
              ...prev,
              messages: prev.messages.filter((m) => m.id !== optimisticUserMsg.id),
            }
          }
        )
        setState((s) => ({ ...s, error: err.message || "Something went wrong. Try again." }))
      } finally {
        setState((s) => ({ ...s, isStreaming: false, streamingContent: "" }))
      }
    },
    [sessionId, state.isStreaming, qc]
  )

  const clearError = useCallback(() => setState((s) => ({ ...s, error: null })), [])

  return { ...state, sendMessage, clearError }
}
