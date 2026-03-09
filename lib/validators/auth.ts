import { z } from "zod";

export const signupSchema = z
  .object({
    name: z.string().min(1, "Name must be at least 1 character"),
    email: z
      .string()
      .email("Invalid email address")
      .refine(
        (email) => email.toLowerCase().endsWith("@gmail.com"),
        "Only Gmails are allowed"
      ),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export type SignupSchema = z.infer<typeof signupSchema>;
export type LoginSchema = z.infer<typeof loginSchema>;