import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "@/lib/prisma";
import { Resend } from "resend";
import VerifyEmail from "@/components/emails/verify-email";
import ForgotPasswordEmail from "@/components/emails/reset-password";

const resend = new Resend(process.env.RESEND_API_KEY);

console.log("EMAIL_FROM:", process.env.EMAIL_FROM); //CHECK

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

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
      sendResetPassword: async ({ user, url, token }) => {
      console.log("RESET PASSWORD EMAIL");
      console.log("User:", user.email);
      console.log("Token:", token);
      console.log("URL:", url);

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

    onPasswordReset: async ({ user }) => {
      console.log(`Password for user ${user.email} has been reset.`);
    },

    requireEmailVerification: true,
  },

  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      console.log("Verification email triggered");
      console.log("User:", user.email);
      console.log("URL:", url);

      const result = await resend.emails.send({
        from: process.env.EMAIL_FROM!,
        to: user.email,
        subject: "Verify your email",
        react: VerifyEmail({
          username: user.name,
          verifyUrl: url,
        }),
      });
      console.log("Resend result:", result);
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

