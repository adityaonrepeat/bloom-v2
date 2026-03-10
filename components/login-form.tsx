"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

import { signIn } from "@/lib/auth-client"
import { loginEmail } from "@/server/auth-actions"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { loginSchema, LoginSchema } from "@/lib/validators/auth"

import { useState } from "react"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {

  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  })

  const onSubmit = async (data: LoginSchema) => {
    setServerError(null)

    const formData = new FormData()
    formData.append("email", data.email)
    formData.append("password", data.password)

    try {
      const res = await loginEmail({ error: null }, formData)

      if (res?.error) {
        setServerError(res.error)
      }
    } catch (err: any) {
      // ignore Next.js redirect error
      if (!err?.message?.includes("NEXT_REDIRECT")) {
        console.error(err)
        setServerError("Something went wrong")
      }
    }
  }

  const handleLoginWithGoogle = async () => {
    await signIn.social({
      provider: "google",
      callbackURL: "/dashboard",
    })
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <FieldGroup>

        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Login to your account</h1>
          <p className="text-sm text-balance text-muted-foreground">
            Enter your email below to login to your account
          </p>
        </div>

        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            {...register("email")}
          />
          {errors.email && (
            <FieldDescription className="text-red-500">
              {errors.email.message}
            </FieldDescription>
          )}
        </Field>

        <Field>
          <div className="flex items-center">
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <a
              href="/forgot-password"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              Forgot your password?
            </a>
          </div>

          <Input
            id="password"
            type="password"
            {...register("password")}
          />

          {errors.password && (
            <FieldDescription className="text-red-500">
              {errors.password.message}
            </FieldDescription>
          )}
        </Field>

        {serverError && (
          <FieldDescription className="text-red-500 text-center">
            {serverError}
          </FieldDescription>
        )}

        <Field>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Logging in..." : "Login"}
          </Button>
        </Field>

        <FieldSeparator>Or continue with</FieldSeparator>

        <Field>
          <Button
            variant="outline"
            type="button"
            onClick={handleLoginWithGoogle}
          >
            Login with Google
          </Button>

          <FieldDescription className="text-center">
            Don&apos;t have an account?{" "}
            <a href="/signup" className="underline underline-offset-4">
              Sign up
            </a>
          </FieldDescription>
        </Field>

      </FieldGroup>
    </form>
  )
}