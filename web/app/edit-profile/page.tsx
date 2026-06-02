import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import prisma from "@/lib/prisma"
import TopNav from "@/app/components/bloom/TopNav"
import { EditProfileForm } from "./EditProfileForm"

export default async function EditProfilePage() {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session?.user) {
    redirect("/login")
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id }
  })

  if (!user) {
    redirect("/login")
  }

  return (
    <div className="min-h-screen" style={{ background: "#f7f4ef" }}>
      <TopNav />

      <main className="max-w-xl mx-auto px-6 pt-24 pb-16">
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            background: "#ffffff",
            border: "1px solid rgba(40,49,44,0.08)",
            boxShadow: "0 4px 24px rgba(40,49,44,0.06)",
          }}
        >
          <div
            className="px-8 pt-8 pb-6"
            style={{ borderBottom: "1px solid rgba(40,49,44,0.07)" }}
          >
            <p
              className="eyebrow mb-1"
              style={{ color: "rgba(40,49,44,0.4)" }}
            >
              Account
            </p>
            <h1
              className="font-display"
              style={{
                fontSize: "28px",
                letterSpacing: "-0.02em",
                color: "#28312C",
                lineHeight: 1.1,
              }}
            >
              Edit Profile
            </h1>
            <p
              className="mt-1.5 text-sm"
              style={{ color: "rgba(40,49,44,0.48)" }}
            >
              Manage your name and account details.
            </p>
          </div>

          <div className="px-8 py-8">
            <EditProfileForm
              initialName={user.name || ""}
              email={user.email || ""}
            />
          </div>
        </div>
      </main>
    </div>
  )
}
