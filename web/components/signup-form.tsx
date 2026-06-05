"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { signIn, signUp } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { signupSchema, SignupSchema } from "@/lib/validators/auth"

const inputStyle = {
  background: "rgba(255,255,255,0.9)",
  border: "1px solid rgba(40,49,44,0.15)",
  borderRadius: "12px",
  color: "#28312C",
}

const inputClass = "h-11 focus-visible:ring-[#C67156]/40 focus-visible:border-[#C67156]/60 placeholder:text-stone-400"

export function SignupForm({ className, ...props }: React.ComponentProps<"form">) {
  const router = useRouter()
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupSchema>({
    resolver: zodResolver(signupSchema),
    mode: "onChange",
  })

  const onSubmit = async (data: SignupSchema) => {
    setServerError(null)
    try {
      const res = await signUp.email({ name: data.name, email: data.email, password: data.password })
      if (res?.error) {
        setServerError(res?.error?.message || "Registration failed")
      } else {
        // Email verification is off, so signUp auto-signs the user in — go
        // straight to the dashboard. (When verification is re-enabled, point
        // this back to "/verify-email".)
        router.push("/dashboard")
      }
    } catch {
      setServerError("Something went wrong")
    }
  }

  const handleSignupWithGoogle = async () => {
    await signIn.social({ provider: "google", callbackURL: "/dashboard" })
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn("flex flex-col gap-4", className)}
      {...props}
    >
      {/* Name */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="name" style={{ color: "#28312C", fontSize: "13px", fontWeight: 500 }}>
          Full Name
        </Label>
        <Input
          id="name"
          placeholder="Your name"
          {...register("name")}
          style={inputStyle}
          className={inputClass}
        />
        {errors.name && (
          <p className="text-xs" style={{ color: "#C67156" }}>{errors.name.message}</p>
        )}
      </div>

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
          style={inputStyle}
          className={inputClass}
        />
        {errors.email && (
          <p className="text-xs" style={{ color: "#C67156" }}>{errors.email.message}</p>
        )}
      </div>

      {/* Password */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="password" style={{ color: "#28312C", fontSize: "13px", fontWeight: 500 }}>
          Password
        </Label>
        <Input
          id="password"
          type="password"
          placeholder="Min. 8 characters"
          {...register("password")}
          style={inputStyle}
          className={inputClass}
        />
        {errors.password && (
          <p className="text-xs" style={{ color: "#C67156" }}>{errors.password.message}</p>
        )}
      </div>

      {/* Confirm password */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="confirm-password" style={{ color: "#28312C", fontSize: "13px", fontWeight: 500 }}>
          Confirm Password
        </Label>
        <Input
          id="confirm-password"
          type="password"
          placeholder="Repeat your password"
          {...register("confirmPassword")}
          style={inputStyle}
          className={inputClass}
        />
        {errors.confirmPassword && (
          <p className="text-xs" style={{ color: "#C67156" }}>{errors.confirmPassword.message}</p>
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
        className="h-11 rounded-full text-sm font-medium mt-1 transition-all"
        style={{ background: "#28312C", color: "#f7f4ef" }}
      >
        {isSubmitting ? "Creating account…" : "Create account"}
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
        onClick={handleSignupWithGoogle}
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
