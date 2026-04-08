"use server"

import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import prisma from "@/lib/prisma"

export async function updateProfile(newName: string) {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session?.user) {
    return { success: false, error: "Unauthorized" }
  }

  if (!newName || newName.trim().length === 0) {
    return { success: false, error: "Name cannot be empty" }
  }

  try {
    await prisma.user.update({
      where: { id: session.user.id },
      data: { name: newName.trim() }
    })
    return { success: true }
  } catch (err) {
    return { success: false, error: "Failed to update profile" }
  }
}
