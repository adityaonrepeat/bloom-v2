import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "@/lib/prisma";
import { Resend } from "resend";
import VerifyEmail from "@/components/emails/verify-email";
import ForgotPasswordEmail from "@/components/emails/reset-password";

const resend = new Resend(process.env.RESEND_API_KEY);

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  // Surface isBlocked on the session user so the proxy can gate EVERY
  // protected route, not just /dashboard. input:false prevents clients from
  // ever setting it themselves via signup/update.
  user: {
    additionalFields: {
      isBlocked: {
        type: "boolean",
        defaultValue: false,
        input: false,
      },
    },
  },

  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url }) => {
      await resend.emails.send({
        from: process.env.EMAIL_FROM!,
        to: user.email,
        subject: "Reset your password",
        react: ForgotPasswordEmail({
          username: user.name,
          userEmail: user.email,
          resetUrl: url,
        }),
      });
    },

    // Email verification is OFF for now (DNS/domain still settling).
    // To turn it back ON: set this to true AND set sendOnSignUp: true below.
    requireEmailVerification: false,
  },

  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      await resend.emails.send({
        from: process.env.EMAIL_FROM!,
        to: user.email,
        subject: "Verify your email",
        react: VerifyEmail({
          username: user.name,
          verifyUrl: url,
        }),
      });
    },
    // Flip to true to send a verification email on signup (re-enables the flow).
    sendOnSignUp: false,
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
});

