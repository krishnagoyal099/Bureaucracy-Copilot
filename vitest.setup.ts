import { vi } from 'vitest';
import { PrismaClient } from '@prisma/client';
import { mockDeep } from 'vitest-mock-extended';

// 1. Mock Prisma Client
vi.mock('@/lib/db/prisma', () => {
  const mockPrisma = mockDeep<PrismaClient>();
  return { prisma: mockPrisma };
});

// 2. Mock Next.js Navigation & Cache
vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
  notFound: vi.fn(),
}));
vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

// 3. Mock Auth Session (Assume user is logged in for dashboard tests)
vi.mock('@/lib/auth/session', () => ({
  requireUser: vi.fn().mockResolvedValue({ 
    id: 'user_123', 
    email: 'test@test.com', 
    role: 'USER',
    name: 'Test User'
  }),
}));

// 4. Mock Rate Limiting (Always allow in tests)
vi.mock('@/lib/rate-limit/redis', () => ({
  checkRateLimit: vi.fn().mockResolvedValue({ success: true, limit: 10, remaining: 9, reset: 0 }),
}));

// 5. Mock Environment Variables
vi.mock('@/config/env', () => ({
  env: {
    NODE_ENV: 'test',
    PII_ENCRYPTION_KEY: '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef',
    ASI_ONE_API_KEY: 'test_key',
    ASI_ONE_BASE_URL: 'http://localhost',
    ASI_ONE_MODEL: 'asi1',
  }
}));

// 6. Mock Next.js Server (unstable_after)
vi.mock('next/server', () => ({
  unstable_after: vi.fn((cb) => cb()),
}));
