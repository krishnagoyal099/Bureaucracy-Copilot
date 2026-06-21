// src/lib/validation/document.ts
import { z } from "zod";

export const DocumentCategorySchema = z.enum([
  "ID_PROOF", "ADDRESS_PROOF", "INCOME_PROOF", "EDUCATION",
  "RESUME", "PHOTO", "MEDICAL", "FINANCIAL", "OTHER",
]);

export const DocumentUploadAckSchema = z.object({
  uploadThingKey: z.string().min(1),
  fileName: z.string().min(1).max(255),
  fileSize: z.number().int().positive().max(10 * 1024 * 1024),
  mimeType: z.enum(["application/pdf", "image/png", "image/jpeg"]),
});
export type DocumentUploadAck = z.infer<typeof DocumentUploadAckSchema>;