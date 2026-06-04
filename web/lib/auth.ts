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
    // sendResetPassword: async ({ user, url }) => {
    //   await resend.emails.send({
    //     from: process.env.EMAIL_FROM!,
    //     to: user.email,
    //     subject: "Reset your password",
    //     react: ForgotPasswordEmail({
    //       username: user.name,
    //       resetUrl: url,
    //       userEmail: user.email,
    //     }),
    //   });
    // },
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

    requireEmailVerification: true,
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
    sendOnSignUp: true,
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
});

