import {
  useQuery,
  useMutation,
  useQueryClient,
  type QueryClient,
} from "@tanstack/react-query"

export interface AasthaMessage {
  id: string
  role: "user" | "assistant"
  content: string
  createdAt: string
}

export interface AasthaSession {
  id: string
  title: string
  emotionTag?: string | null
  emotionScore?: number | null
  updatedAt: string
  messages?: AasthaMessage[]
  _count?: { messages: number }
}

export const keys = {
  sessions: ["aastha", "sessions"] as const,
  messages: (sessionId: string) => ["aastha", "messages", sessionId] as const,
}

export function useSessions() {
  return useQuery<AasthaSession[]>({
    queryKey: keys.sessions,
    queryFn: async () => {
      const res = await fetch("/api/aastha/sessions")
      if (!res.ok) throw new Error("Failed to load sessions")
      const data = await res.json()
      return data.sessions
    },
    staleTime: 30_000,
  })
}

export function useCreateSession() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (title?: string): Promise<AasthaSession> => {
      const res = await fetch("/api/aastha/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      })
      if (!res.ok) throw new Error("Failed to create session")
      const data = await res.json()
      return data.session
    },
    onSuccess: (newSession) => {
      qc.setQueryData<AasthaSession[]>(keys.sessions, (prev = []) => [newSession, ...prev])
    },
  })
}

export function useDeleteSession() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/aastha/sessions?id=${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Failed to delete session")
    },
    onSuccess: (_data, deletedId) => {
      qc.setQueryData<AasthaSession[]>(keys.sessions, (prev = []) =>
        prev.filter((s) => s.id !== deletedId)
      )
      qc.removeQueries({ queryKey: keys.messages(deletedId) })
    },
  })
}

export function updateSessionTitle(qc: QueryClient, sessionId: string, title: string) {
  qc.setQueryData<AasthaSession[]>(keys.sessions, (prev = []) =>
    prev.map((s) =>
      s.id === sessionId ? { ...s, title, updatedAt: new Date().toISOString() } : s
    )
  )
}

export function useMessages(sessionId: string | null) {
  return useQuery<{ messages: AasthaMessage[]; sessionMeta: AasthaSession }>({
    queryKey: keys.messages(sessionId ?? ""),
    queryFn: async () => {
      const res = await fetch(`/api/aastha/messages?sessionId=${sessionId}`)
      if (!res.ok) throw new Error("Failed to load messages")
      return res.json()
    },
    enabled: !!sessionId,
    staleTime: Infinity,
  })
}
