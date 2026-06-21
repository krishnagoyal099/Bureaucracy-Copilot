// src/lib/ai/services/action-plan.ts
import { randomUUID } from "crypto";
import { callAsione } from "../asi-one";
import { ActionPlanResultSchema, type ActionPlanResult } from "../schemas";
import { buildActionPlanPrompt } from "../prompts";
import { prisma } from "@/lib/db/prisma";

interface Ctx { userId: string; opportunityId: string }

export async function generateActionPlan(ctx: Ctx) {
  const [opp, eligibility, docReqs] = await Promise.all([
    prisma.opportunity.findUniqueOrThrow({ where: { id: ctx.opportunityId } }),
    prisma.eligibilityReport.findFirst({
      where: { opportunityId: ctx.opportunityId },
      orderBy: { version: "desc" },
    }),
    prisma.docRequirement.findMany({ where: { opportunityId: ctx.opportunityId } }),
  ]);

  const missing = docReqs
    .filter((d) => d.status === "MISSING")
    .map((d) => ({ requirement: d.requirement, isOptional: d.isOptional }));

  const steps = opp.applicationSteps ?? [];
  const deadlines = opp.deadlines ?? [];

  const currentReadiness = (() => {
    const total = docReqs.length || 1;
    const matched = docReqs.filter((d) => d.status === "MATCHED").length;
    return Math.round((matched / total) * 100);
  })();

  const { system, user } = buildActionPlanPrompt({
    eligibility: eligibility?.rawModelOutput ?? null,
    missing, steps, deadlines,
    currentReadiness,
  });

  const result = await callAsione<ActionPlanResult>(
    [{ role: "system", content: system }, { role: "user", content: user }],
    ActionPlanResultSchema,
    { operationId: randomUUID(), temperature: 0.3, maxTokens: 2048 }
  );
  return result.data;
}
