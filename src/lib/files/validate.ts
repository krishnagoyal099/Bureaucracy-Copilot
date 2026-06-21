// src/lib/files/validate.ts
import { bufferMagicBytes } from "@/lib/constants";

const MAX_SIZE = 10 * 1024 * 1024;

export function validateFile(buffer: Buffer, mimeType: string): { ok: boolean; reason?: string } {
  if (buffer.length > MAX_SIZE) return { ok: false, reason: "File too large" };
  const magic = buffer.subarray(0, 4).toString("hex");
  const expected = bufferMagicBytes[mimeType];
  if (expected && !expected.includes(magic)) return { ok: false, reason: "Magic-byte mismatch" };
  return { ok: true };
}