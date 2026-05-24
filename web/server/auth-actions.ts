"use server"

import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

export async function registerEmail(
  prevState: { error: string | null },
  formData: FormData
) {

  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const name = formData.get("name") as string

  // check if user exists
  const existingUser = await prisma.user.findUnique({
    where: { email }
  })

  if (existingUser) {

    if (existingUser.emailVerified) {
      return { error: "Account already exists. Please login." }
    }

    // resend verification
    await auth.api.sendVerificationEmail({
      body: { email }
    })

    return { success: true }
  }

  // create account
  await auth.api.signUpEmail({
    body: {
      email,
      password,
      name,
    },
  })

  return { success: true }
}

export async function loginEmail(
  prevState: { error: string | null },
  formData: FormData
) {
  try {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const result = await auth.api.signInEmail({
      body: { email, password },
      headers: await headers(),
    });

    console.log("LOGIN RESULT:", result);

  } catch (err: any) {
    console.error("LOGIN ERROR:", err);

    return {
      error: err.message ?? "Invalid credentials",
    };
  }

  return { success: true };
}

export async function signOut() {
  await auth.api.signOut({
    headers: await headers(),
  });

  redirect("/login");
}