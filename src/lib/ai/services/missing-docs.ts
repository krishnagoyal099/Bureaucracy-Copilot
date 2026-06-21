// src/lib/ai/services/missing-docs.ts
import { randomUUID } from "crypto";
import { callAsione } from "../asi-one";
import { MissingDocsResultSchema, type MissingDocsResult } from "../schemas";
import { buildMissingDocsPrompt } from "../prompts";
import { prisma } from "@/lib/db/prisma";

interface Ctx { userId: string; opportunityId: string }

export async function generateMissingDocs(ctx: Ctx) {
  const [opp, documents] = await Promise.all([
    prisma.opportunity.findUniqueOrThrow({ where: { id: ctx.opportunityId } }),
    prisma.document.findMany({
      where: { userId: ctx.userId, deletedAt: null, status: "READY" },
      select: { id: true, fileName: true, category: true, extractedJson: true },
    }),
  ]);

  const required = ((opp.requiredDocuments as Array<{ name: string; category: string; isOptional: boolean }>) ?? [])
    .map((r) => ({ name: r.name, category: r.category, isOptional: r.isOptional }));

  const available = documents.map((d) => ({
    id: d.id,
    name: d.fileName,
    category: d.category,
    documentType: (d.extractedJson as { classification?: { documentType?: string } } | null)
      ?.classification?.documentType ?? d.fileName,
  }));

  const { system, user } = buildMissingDocsPrompt({ required, available });
  const result = await callAsione<MissingDocsResult>(
    [{ role: "system", content: system }, { role: "user", content: user }],
    MissingDocsResultSchema,
    { operationId: randomUUID(), temperature: 0.1, maxTokens: 2048 }
  );
  return result.data;
}
