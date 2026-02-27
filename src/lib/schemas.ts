import { z } from "zod";

// Signup Schema
export const signupSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "Full name is required")
      .min(2, "Name must be at least 2 characters"),
    email: z
      .string()
      .trim()
      .min(1, "Email is required")
      .email("Please enter a valid email address"),
    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters")
      .regex(/\d/, "Password must contain at least 1 number"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    role: z.enum(["tourist", "provider"], {
      errorMap: () => ({ message: "Please select an account type" }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type SignupFormData = z.infer<typeof signupSchema>;

// Login Schema
export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// Provider Profile Schema
export const providerProfileSchema = z.object({
  businessName: z
    .string()
    .trim()
    .min(1, "Business name is required")
    .min(3, "Business name must be at least 3 characters"),
  region: z.string().min(1, "Please select a region"),
  bio: z.string().max(500, "Bio must be 500 characters or fewer").optional(),
  languages: z.array(z.string()).optional(),
  phone: z.string().optional(),
});

export type ProviderProfileFormData = z.infer<typeof providerProfileSchema>;
