// src/lib/validation/opportunity.ts
import { z } from "zod";

export const OpportunityTypeSchema = z.enum([
  "SCHOLARSHIP", "INTERNSHIP", "ADMISSION", "GOVERNMENT_SCHEME", "VISA", "JOB", "OTHER",
]);

export const OpportunityInputSchema = z.object({
  title: z.string().min(3).max(200),
  type: OpportunityTypeSchema,
  sourceUrl: z.string().url().optional(),
  provider: z.string().max(200).optional(),
  uploadThingKey: z.string().min(1),
  fileName: z.string().min(1).max(255),
  fileSize: z.number().int().positive().max(20 * 1024 * 1024),
  mimeType: z.enum(["application/pdf", "image/png", "image/jpeg"]),
});
export type OpportunityInput = z.infer<typeof OpportunityInputSchema>;