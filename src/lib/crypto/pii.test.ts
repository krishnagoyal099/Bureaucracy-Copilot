import { describe, it, expect } from 'vitest';
import { encryptPII, decryptPII, toStorage, fromStorage } from './pii';

describe('PII Encryption (AES-256-GCM)', () => {
  it('should encrypt and decrypt text correctly', () => {
    const plaintext = 'Sensitive SSN: 123-45-6789';
    const encrypted = encryptPII(plaintext);
    
    expect(encrypted.ciphertext).toBeInstanceOf(Buffer);
    expect(encrypted.iv.length).toBe(12); // GCM standard IV
    expect(encrypted.tag.length).toBe(16); // GCM standard Tag
    
    const decrypted = decryptPII(encrypted.ciphertext, encrypted.iv, encrypted.tag);
    expect(decrypted).toBe(plaintext);
  });

  it('should correctly pack and unpack for database storage', () => {
    const encrypted = encryptPII('Test Data');
    const stored = toStorage(encrypted);
    
    // Combined should be tag (16B) + ciphertext
    expect(stored.combined.length).toBe(encrypted.ciphertext.length + 16);
    
    const unpacked = fromStorage(stored.combined, stored.iv);
    expect(unpacked.ciphertext.equals(encrypted.ciphertext)).toBe(true);
    expect(unpacked.tag.equals(encrypted.tag)).toBe(true);
  });
});
