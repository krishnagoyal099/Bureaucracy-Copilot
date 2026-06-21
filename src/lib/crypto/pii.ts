// src/lib/crypto/pii.ts
import { createCipheriv, createDecipheriv, randomBytes } from "crypto";
import { env } from "@/config/env";

const KEY = Buffer.from(env.PII_ENCRYPTION_KEY, "hex");
const ALGO = "aes-256-gcm";

export interface EncryptedBlob { ciphertext: Buffer; iv: Buffer; tag: Buffer }

export function encryptPII(plaintext: string): EncryptedBlob {
  const iv = randomBytes(12);
  const cipher = createCipheriv(ALGO, KEY, iv);
  const ciphertext = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return { ciphertext, iv, tag };
}

export function decryptPII(ciphertext: Buffer, iv: Buffer, tag: Buffer): string {
  const decipher = createDecipheriv(ALGO, KEY, iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(ciphertext), decipher.final()]).toString("utf8");
}

// Combine tag into ciphertext for storage simplicity: tag (16B) || ciphertext
export function toStorage({ ciphertext, iv, tag }: EncryptedBlob) {
  return { combined: Buffer.concat([tag, ciphertext]), iv };
}
export function fromStorage(combined: Buffer, iv: Buffer): EncryptedBlob {
  const tag = combined.subarray(0, 16);
  const ciphertext = combined.subarray(16);
  return { ciphertext, iv, tag };
}