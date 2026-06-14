"use client"

import { Sparkles, ShieldCheck, Moon, Heart, SquarePen, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  useSessions,
  useCreateSession,
  useDeleteSession,
  type AasthaSession,
} from "@/hooks/useAastha"
import { SessionItem, SessionItemSkeleton } from "./SessionItem"

const TRAITS = [
  { Icon: Sparkles,   label: "Trauma-informed"   },
  { Icon: ShieldCheck, label: "Zero data training" },
  { Icon: Moon,       label: "24/7, never tired"  },
  { Icon: Heart,      label: "Freedom gently"      },
]

interface SidebarProps {
  activeSessionId: string | null
  onSelectSession: (id: string) => void
  onSessionCreated: (session: AasthaSession) => void
  onClose: () => void
}

export function Sidebar({ activeSessionId, onSelectSession, onSessionCreated, onClose }: SidebarProps) {
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
    <div className="flex h-full flex-col" style={{ fontFamily: "var(--font-figtree), ui-sans-serif, sans-serif" }}>

      <div
        className="flex items-center justify-between px-4 py-3 shrink-0"
        style={{ borderBottom: "1px solid rgba(40,49,44,0.07)" }}
      >
        <p
          className="text-[10px] font-semibold tracking-widest uppercase"
          style={{ color: "rgba(40,49,44,0.4)" }}
        >
          Sessions
        </p>

        <div className="flex items-center gap-0.5">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 rounded-lg transition-opacity hover:opacity-60"
            style={{ color: "#5D6862" }}
            onClick={handleNew}
            disabled={isCreating}
            title="New session"
          >
            <SquarePen className="h-3.5 w-3.5" />
          </Button>
          {/* Close button — mobile only */}
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 rounded-lg transition-opacity hover:opacity-60 md:hidden"
            style={{ color: "#5D6862" }}
            onClick={onClose}
            title="Close"
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      <div className="aastha-sessions-scroll flex-1 overflow-y-auto min-h-0 p-2">
        {isLoading ? (
          <div className="space-y-0.5">
            {[1, 2, 3, 4].map((i) => <SessionItemSkeleton key={i} />)}
          </div>
        ) : sessions.length === 0 ? (
          <p
            className="px-3 py-8 text-center text-xs leading-relaxed"
            style={{ color: "rgba(40,49,44,0.35)" }}
          >
            No sessions yet.<br />Use the pencil to start one.
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

      <div
        className="shrink-0"
        style={{ borderTop: "1px solid rgba(40,49,44,0.07)" }}
      >
        <div className="px-4 py-4">
          <p
            className="text-[10px] font-semibold tracking-widest uppercase mb-3"
            style={{ color: "rgba(40,49,44,0.38)" }}
          >
            Aastha is
          </p>
          <div className="space-y-2.5">
            {TRAITS.map(({ Icon, label }) => (
              <div key={label} className="flex items-center gap-2.5">
                <Icon
                  size={13}
                  strokeWidth={1.5}
                  style={{ color: "#D96A4E", flexShrink: 0 }}
                />
                <span className="text-[12.5px]" style={{ color: "#5D6862" }}>
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="px-4 pb-3">
          <p className="text-center text-[10px]" style={{ color: "rgba(40,49,44,0.25)" }}>
            Sessions are private and confidential.
          </p>
        </div>
      </div>
    </div>
  )
}
