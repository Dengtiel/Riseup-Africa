import { z } from "zod";

export const updateProfileSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phone: z.string().optional(),
  category: z.enum(["REFUGEE", "IDP", "VULNERABLE", "PWD"]).optional(),
  country: z.string().optional(),
  camp: z.string().optional(),
  community: z.string().optional(),
  dateOfBirth: z.string().optional(), // ISO date string
  gender: z.string().optional(),
  organizationName: z.string().optional(),
  organizationType: z.string().optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

