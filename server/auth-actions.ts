"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function registerEmail(
    prevState: { error: string | null },
    formData: FormData
) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirm-password") as string;

  if (password !== confirmPassword) {
    return { error: "Passwords do not match" };
  }

  await auth.api.signUpEmail({
    body: {
      email,
      password,
      name,
    },
    headers: await headers(),
  });

  redirect("/dashboard");
}

export async function loginEmail(
    prevState: { error: string | null },
    formData: FormData
) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  await auth.api.signInEmail({
    body: {
      email,
      password,
    },
    headers: await headers(),
  });

  redirect("/dashboard");
}

export async function signOut() {
  await auth.api.signOut({
    headers: await headers(),
  });

  redirect("/login");
}