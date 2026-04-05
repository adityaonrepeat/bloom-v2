"use client"

import { SquarePen } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  useSessions,
  useCreateSession,
  useDeleteSession,
  type AasthaSession,
} from "@/hooks/useAastha"
import { SessionItem, SessionItemSkeleton } from "./SessionItem"

interface SidebarProps {
  activeSessionId: string | null
  onSelectSession: (id: string) => void
  onSessionCreated: (session: AasthaSession) => void
}

export function Sidebar({ activeSessionId, onSelectSession, onSessionCreated }: SidebarProps) {
  const { data: sessions = [], isLoading } = useSessions()
  const { mutate: createSession, isPending: isCreating } = useCreateSession()
  const { mutate: deleteSession, variables: deletingId } = useDeleteSession()

  const handleNew = () => {
    createSession(undefined, {
      onSuccess: (session) => {
        onSessionCreated(session)
        onSelectSession(session.id)
      },
    })
  }

  const handleDelete = (id: string) => {
    deleteSession(id, {
      onSuccess: () => {
        if (activeSessionId === id) onSelectSession("")
      },
    })
  }

  return (
    <div className="flex h-full flex-col border-r bg-muted/30">
      {/* Header */}
      <div className="flex items-center justify-between border-b px-4 py-3.5">
        <div className="flex items-center gap-2">
          <span className="text-lg leading-none">🌸</span>
          <span className="text-sm font-semibold tracking-tight text-foreground">Aastha</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground"
          onClick={handleNew}
          disabled={isCreating}
          title="New session"
        >
          <SquarePen className="h-4 w-4" />
        </Button>
      </div>

      {/* Session list */}
      <div className="flex-1 overflow-y-auto p-2">
        {isLoading ? (
          <div className="space-y-0.5">
            {[1, 2, 3, 4].map((i) => (
              <SessionItemSkeleton key={i} />
            ))}
          </div>
        ) : sessions.length === 0 ? (
          <p className="px-3 py-8 text-center text-xs text-muted-foreground">
            No sessions yet.
            <br />
            Start one with the button above.
          </p>
        ) : (
          <div className="space-y-0.5">
            {sessions.map((s) => (
              <SessionItem
                key={s.id}
                session={s}
                isActive={s.id === activeSessionId}
                onSelect={() => onSelectSession(s.id)}
                onDelete={() => handleDelete(s.id)}
                isDeleting={deletingId === s.id}
              />
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t px-4 py-3">
        <p className="text-center text-[10px] text-muted-foreground/60">
          Sessions are private and confidential.
        </p>
      </div>
    </div>
  )
}
