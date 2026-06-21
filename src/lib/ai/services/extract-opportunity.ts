// src/lib/ai/services/extract-opportunity.ts
import { randomUUID } from "crypto";
import { callAsione } from "../asi-one";
import { OpportunityRequirementsSchema, type OpportunityRequirements } from "../schemas";
import { buildOpportunityPrompt } from "../prompts";

export async function extractOpportunityService(text: string, meta: { title: string; type: string }) {
  const { system, user } = buildOpportunityPrompt(text, meta);
  const result = await callAsione<OpportunityRequirements>(
    [{ role: "system", content: system }, { role: "user", content: user }],
    OpportunityRequirementsSchema,
    { operationId: randomUUID(), temperature: 0.2, maxTokens: 4096 }
  );
  return result.data;
}
