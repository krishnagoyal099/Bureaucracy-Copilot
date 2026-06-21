// src/lib/ai/cost.ts
const PRICING_USD_PER_1M: Record<string, { in: number; out: number }> = {
  asi1: { in: 0.6, out: 1.8 },
  "asi1-mini": { in: 0.2, out: 0.6 },
};

export function computeCostUsd(model: string, tokensIn: number, tokensOut: number): number {
  const p = PRICING_USD_PER_1M[model] ?? { in: 0.6, out: 1.8 };
  return (tokensIn * p.in + tokensOut * p.out) / 1_000_000;
}