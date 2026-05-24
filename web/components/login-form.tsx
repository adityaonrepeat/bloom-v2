"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { signIn } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { loginSchema, LoginSchema } from "@/lib/validators/auth"
import { useState } from "react"

export function LoginForm({ className, ...props }: React.ComponentProps<"form">) {
  const router = useRouter()
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
    try {
      const res = await signIn.email({ email: data.email, password: data.password })
      if (res?.error) {
        setServerError(res?.error?.message || "Invalid credentials")
      } else {
        router.push("/dashboard")
      }
    } catch {
      setServerError("Something went wrong")
    }
  }

  const handleLoginWithGoogle = async () => {
    await signIn.social({ provider: "google", callbackURL: "/dashboard" })
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn("flex flex-col gap-5", className)}
      {...props}
    >
      {/* Email */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="email" style={{ color: "#28312C", fontSize: "13px", fontWeight: 500 }}>
          Email
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          {...register("email")}
          style={{
            background: "rgba(255,255,255,0.9)",
            border: "1px solid rgba(40,49,44,0.15)",
            borderRadius: "12px",
            color: "#28312C",
          }}
          className="h-11 focus-visible:ring-[#C67156]/40 focus-visible:border-[#C67156]/60 placeholder:text-stone-400"
        />
        {errors.email && (
          <p className="text-xs" style={{ color: "#C67156" }}>{errors.email.message}</p>
        )}
      </div>

      {/* Password */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <Label htmlFor="password" style={{ color: "#28312C", fontSize: "13px", fontWeight: 500 }}>
            Password
          </Label>
          <a
            href="/forgot-password"
            className="text-xs transition-opacity hover:opacity-70"
            style={{ color: "#5D6862" }}
          >
            Forgot password?
          </a>
        </div>
        <Input
          id="password"
          type="password"
          {...register("password")}
          style={{
            background: "rgba(255,255,255,0.9)",
            border: "1px solid rgba(40,49,44,0.15)",
            borderRadius: "12px",
            color: "#28312C",
          }}
          className="h-11 focus-visible:ring-[#C67156]/40 focus-visible:border-[#C67156]/60"
        />
        {errors.password && (
          <p className="text-xs" style={{ color: "#C67156" }}>{errors.password.message}</p>
        )}
      </div>

      {serverError && (
        <p
          className="text-sm text-center rounded-xl px-4 py-2.5"
          style={{ color: "#C67156", background: "rgba(198,113,86,0.08)", border: "1px solid rgba(198,113,86,0.2)" }}
        >
          {serverError}
        </p>
      )}

      {/* Submit */}
      <Button
        type="submit"
        disabled={isSubmitting}
        className="h-11 rounded-full text-sm font-medium transition-all"
        style={{ background: "#28312C", color: "#f7f4ef" }}
      >
        {isSubmitting ? "Signing in…" : "Sign in"}
      </Button>

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px" style={{ background: "rgba(40,49,44,0.1)" }} />
        <span className="text-xs" style={{ color: "#5D6862" }}>or continue with</span>
        <div className="flex-1 h-px" style={{ background: "rgba(40,49,44,0.1)" }} />
      </div>

      {/* Google */}
      <Button
        variant="outline"
        type="button"
        onClick={handleLoginWithGoogle}
        className="h-11 rounded-full text-sm font-medium gap-2.5 transition-all"
        style={{
          background: "rgba(255,255,255,0.9)",
          border: "1px solid rgba(40,49,44,0.15)",
          color: "#28312C",
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4">
          <path
            d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
            fill="currentColor"
          />
        </svg>
        Continue with Google
      </Button>
    </form>
  )
}
