"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, KeyRound, MailCheck } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type FormValues = z.infer<typeof formSchema>;

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "" },
  });

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    setServerError(null);

    const { error } = await authClient.requestPasswordReset({
      email: values.email,
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      setServerError(error.message ?? "Something went wrong. Please try again.");
    } else {
      setSent(true);
    }

    setIsLoading(false);
  }

  return (
    <div
      className={cn(
        "rounded-3xl border p-8 sm:p-9",
        className
      )}
      style={{
        background: "rgba(255,255,255,0.55)",
        borderColor: "rgba(40,49,44,0.1)",
        boxShadow: "0 24px 70px -30px rgba(40,49,44,0.35)",
        backdropFilter: "blur(8px)",
      }}
      {...props}
    >
      {sent ? (
        <div className="text-center">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-5"
            style={{ background: "rgba(124,152,133,0.15)" }}
          >
            <MailCheck size={22} strokeWidth={1.75} style={{ color: "#5C7A66" }} />
          </div>
          <h1
            style={{
              fontFamily: "var(--font-fraunces), Georgia, serif",
              fontSize: "26px",
              letterSpacing: "-0.02em",
              color: "#28312C",
              lineHeight: 1.15,
            }}
          >
            Check your inbox
          </h1>
          <p className="mt-2.5 text-sm leading-relaxed" style={{ color: "#5D6862" }}>
            If an account exists for{" "}
            <span style={{ color: "#28312C", fontWeight: 500 }}>{getValues("email")}</span>,
            we&rsquo;ve sent a link to reset your password. It may take a minute to arrive.
          </p>

          <a
            href="/login"
            className="group mt-7 inline-flex items-center gap-2 text-sm font-medium transition-opacity hover:opacity-70"
            style={{ color: "#C67156" }}
          >
            <ArrowLeft className="size-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
            Back to sign in
          </a>
        </div>
      ) : (
        <>
          <div className="text-center mb-7">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-5"
              style={{ background: "rgba(198,113,86,0.1)" }}
            >
              <KeyRound size={20} strokeWidth={1.75} style={{ color: "#C67156" }} />
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
              Forgot your password?
            </h1>
            <p className="mt-2 text-sm leading-relaxed" style={{ color: "#5D6862" }}>
              No worries. Enter your email and we&rsquo;ll send you a link to reset it.
            </p>
          </div>

          <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
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

            {serverError && (
              <p
                className="text-sm text-center rounded-xl px-4 py-2.5"
                style={{ color: "#C67156", background: "rgba(198,113,86,0.08)", border: "1px solid rgba(198,113,86,0.2)" }}
              >
                {serverError}
              </p>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="h-11 rounded-full text-sm font-medium transition-all"
              style={{ background: "#28312C", color: "#f7f4ef" }}
            >
              {isLoading ? "Sending…" : "Send reset link"}
            </Button>
          </form>

          <a
            href="/login"
            className="group mt-6 mx-auto flex w-fit items-center gap-2 text-sm transition-opacity hover:opacity-70"
            style={{ color: "#5D6862" }}
          >
            <ArrowLeft className="size-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
            Back to sign in
          </a>
        </>
      )}
    </div>
  );
}
