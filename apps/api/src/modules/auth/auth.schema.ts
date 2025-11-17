import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  firstName: z.string().min(1, "First name is required").optional(),
  lastName: z.string().min(1, "Last name is required").optional(),
  phone: z.string().optional(),
  role: z.enum(["YOUTH", "DONOR", "ADMIN", "FIELD_AGENT"]).default("YOUTH"),
  // Youth-specific fields
  category: z.enum(["REFUGEE", "IDP", "VULNERABLE", "PWD"]).optional(),
  country: z.string().optional(),
  camp: z.string().optional(),
  community: z.string().optional(),
  dateOfBirth: z.string().optional(), // ISO date string
  gender: z.string().optional(),
  // Donor-specific fields
  organizationName: z.string().optional(),
  organizationType: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;

