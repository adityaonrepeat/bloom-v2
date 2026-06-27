"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, LockKeyhole } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { authClient } from "@/lib/auth-client";

const formSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormValues = z.infer<typeof formSchema>;

export function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const token = searchParams.get("token");

  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(
    !token ? "Invalid or expired reset link." : null
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  async function onSubmit(values: FormValues) {
    if (!token) {
      setServerError("Missing reset token.");
      return;
    }

    setIsLoading(true);
    setServerError(null);

    const { error } = await authClient.resetPassword({
      newPassword: values.password,
      token,
    });

    if (error) {
      setServerError(error.message ?? "Something went wrong");
      toast.error(error.message ?? "Something went wrong");
      setIsLoading(false);
      return;
    }

    toast.success("Password reset successfully!");
    router.push("/login");
  }

  return (
    <div
      className="rounded-3xl border p-8 sm:p-9"
      style={{
        background: "rgba(255,255,255,0.55)",
        borderColor: "rgba(40,49,44,0.1)",
        boxShadow: "0 24px 70px -30px rgba(40,49,44,0.35)",
        backdropFilter: "blur(8px)",
      }}
    >
      <div className="text-center mb-7">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-5"
          style={{ background: "rgba(198,113,86,0.1)" }}
        >
          <LockKeyhole size={20} strokeWidth={1.75} style={{ color: "#C67156" }} />
        </div>
        <h1
          style={{
            fontFamily: "var(--font-fraunces), Georgia, serif",
            fontSize: "28px",
            letterSpacing: "-0.02em",
            color: "#28312C",
            lineHeight: 1.1,
          }}
        >
          Set new password
        </h1>
        <p className="mt-2 text-sm leading-relaxed" style={{ color: "#5D6862" }}>
          Choose a strong password for your account.
        </p>
      </div>

      <form method="post" className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="password" style={{ color: "#28312C", fontSize: "13px", fontWeight: 500 }}>
            New password
          </label>
          <input
            id="password"
            type="password"
            placeholder="At least 8 characters"
            {...register("password")}
            className="h-11 px-4 rounded-xl text-sm outline-none transition-all placeholder:text-stone-400 w-full"
            style={{
              background: "rgba(255,255,255,0.9)",
              border: "1px solid rgba(40,49,44,0.15)",
              color: "#28312C",
            }}
            onFocus={(e) => {
              e.currentTarget.style.border = "1px solid rgba(198,113,86,0.6)";
              e.currentTarget.style.boxShadow = "0 0 0 3px rgba(198,113,86,0.1)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.border = "1px solid rgba(40,49,44,0.15)";
              e.currentTarget.style.boxShadow = "none";
            }}
          />
          {errors.password && (
            <p className="text-xs" style={{ color: "#C67156" }}>{errors.password.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="confirmPassword" style={{ color: "#28312C", fontSize: "13px", fontWeight: 500 }}>
            Confirm password
          </label>
          <input
            id="confirmPassword"
            type="password"
            placeholder="Repeat your password"
            {...register("confirmPassword")}
            className="h-11 px-4 rounded-xl text-sm outline-none transition-all placeholder:text-stone-400 w-full"
            style={{
              background: "rgba(255,255,255,0.9)",
              border: "1px solid rgba(40,49,44,0.15)",
              color: "#28312C",
            }}
            onFocus={(e) => {
              e.currentTarget.style.border = "1px solid rgba(198,113,86,0.6)";
              e.currentTarget.style.boxShadow = "0 0 0 3px rgba(198,113,86,0.1)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.border = "1px solid rgba(40,49,44,0.15)";
              e.currentTarget.style.boxShadow = "none";
            }}
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

        <button
          type="submit"
          disabled={isLoading || !token}
          className="h-11 rounded-full text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ background: "#28312C", color: "#f7f4ef" }}
        >
          {isLoading ? "Saving…" : "Reset password"}
        </button>
      </form>

      <a
        href="/login"
        className="group mt-6 mx-auto flex w-fit items-center gap-2 text-sm transition-opacity hover:opacity-70"
        style={{ color: "#5D6862" }}
      >
        <ArrowLeft className="size-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
        Back to sign in
      </a>
    </div>
  );
}
