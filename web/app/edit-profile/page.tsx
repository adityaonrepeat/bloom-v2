import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import prisma from "@/lib/prisma"
import Navbar from "../components/Navbar"
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
    <div className="min-h-screen bg-stone-50">
      <Navbar />

      <main className="max-w-3xl mx-auto px-6 py-12">
        <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
          <div className="p-8 border-b border-stone-200">
            <h1 className="text-2xl font-bold text-stone-800">Edit Profile</h1>
            <p className="text-stone-500 mt-1">Manage your account settings and preferences.</p>
          </div>

          <div className="p-8 space-y-6">
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
