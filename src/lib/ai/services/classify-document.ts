// src/lib/ai/services/classify-document.ts
import { randomUUID } from "crypto";
import { callAsione } from "../asi-one";
import { ClassifiedDocumentSchema, type ClassifiedDocument } from "../schemas";
import { buildClassifyPrompt, PROMPT_VERSION } from "../prompts";
import { prisma } from "@/lib/db/prisma";
import type { ServiceContext } from "./service-context";

export async function classifyDocumentService(text: string, ctx: ServiceContext) {
  const { system, user } = buildClassifyPrompt(text);
  const operationId = randomUUID();
  const result = await callAsione<ClassifiedDocument>(
    [{ role: "system", content: system }, { role: "user", content: user }],
    ClassifiedDocumentSchema,
    { operationId, temperature: 0.1, maxTokens: 1024, signal: ctx.signal }
  );

  await prisma.analysisRun.create({
    data: {
      userId: ctx.userId,
      type: "DOC_CLASSIFY",
      status: "SUCCESS",
      operationId,
      promptVersion: PROMPT_VERSION,
      model: result.model,
      tokensIn: result.tokensIn,
      tokensOut: result.tokensOut,
      latencyMs: result.latencyMs,
      costUsd: result.costUsd,
      resultJson: result.data as unknown as object,
      finishedAt: new Date(),
    },
  }).catch(() => {/* swallow audit failure */});

  return result.data;
}
