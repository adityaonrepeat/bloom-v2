"use client"

import Link from "next/link"
import Image from "next/image"
import { SquarePen, X, PanelLeftClose } from "lucide-react"
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
    <div
      className="flex h-full flex-col"
      style={{ background: "#f2eeea", borderRight: "1px solid rgba(40,49,44,0.1)" }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3.5"
        style={{ borderBottom: "1px solid rgba(40,49,44,0.08)" }}
      >
        <Link
          href="/dashboard"
          className="flex items-center gap-1 w-fit"
          style={{ marginLeft: "-4px" }}
        >
          <Image
            src="/logo.png"
            alt=""
            width={48}
            height={35}
            style={{ mixBlendMode: "multiply", marginRight: "-10px" }}
          />
          <span
            style={{
              fontFamily: "var(--font-fraunces), Georgia, serif",
              fontSize: "16px",
              letterSpacing: "-0.03em",
              color: "#28312C",
              lineHeight: 1,
            }}
          >
            bloom
          </span>
        </Link>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-lg transition-opacity hover:opacity-60"
            style={{ color: "#5D6862" }}
            onClick={handleNew}
            disabled={isCreating}
            title="New session"
          >
            <SquarePen className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="hidden h-8 w-8 rounded-lg transition-opacity hover:opacity-60 md:inline-flex"
            style={{ color: "#5D6862" }}
            onClick={onClose}
            title="Close sidebar"
          >
            <PanelLeftClose className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-lg transition-opacity hover:opacity-60 md:hidden"
            style={{ color: "#5D6862" }}
            onClick={onClose}
            title="Close sidebar"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Session list */}
      <div className="flex-1 overflow-y-auto p-2">
        {isLoading ? (
          <div className="space-y-0.5">
            {[1, 2, 3, 4].map((i) => <SessionItemSkeleton key={i} />)}
          </div>
        ) : sessions.length === 0 ? (
          <p
            className="px-3 py-8 text-center text-xs"
            style={{ color: "#5D6862" }}
          >
            No sessions yet.<br />Start one with the button above.
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
      <div
        className="px-4 py-3"
        style={{ borderTop: "1px solid rgba(40,49,44,0.08)" }}
      >
        <p className="text-center text-[10px]" style={{ color: "rgba(93,104,98,0.5)" }}>
          Sessions are private and confidential.
        </p>
      </div>
    </div>
  )
}
