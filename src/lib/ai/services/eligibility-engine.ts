// src/lib/ai/services/eligibility-engine.ts
import { randomUUID } from "crypto";
import { callAsione } from "../asi-one";
import { EligibilityResultSchema, type EligibilityResult } from "../schemas";
import { buildEligibilityPrompt } from "../prompts";
import { prisma } from "@/lib/db/prisma";
import { decryptPII, fromStorage } from "@/lib/crypto/pii";
import { logger } from "@/lib/logger";

interface Ctx { userId: string; opportunityId: string }

export async function computeEligibility(ctx: Ctx) {
  const [opp, profile, documents] = await Promise.all([
    prisma.opportunity.findUniqueOrThrow({ where: { id: ctx.opportunityId } }),
    prisma.profile.findUnique({ where: { userId: ctx.userId } }),
    prisma.document.findMany({
      where: { userId: ctx.userId, deletedAt: null, status: "READY" },
      select: { id: true, category: true, fileName: true, issuingAuthority: true,
                issueDate: true, expiryDate: true, documentNumber: true,
                extractedJson: true },
    }),
  ]);

  // Decrypt profile fields needed for eligibility (read-only, in-process)
  const decryptedProfile: Record<string, unknown> = profile ? { education: profile.education } : {};
  if (profile) {
    try {
      if (profile.fullNameEncrypted) {
        const fullNameBlob = fromStorage(profile.fullNameEncrypted, profile.fullNameIv);
        decryptedProfile.fullName = decryptPII(fullNameBlob.ciphertext, fullNameBlob.iv, fullNameBlob.tag);
      }
      if (profile.dobEncrypted) {
        const dobBlob = fromStorage(profile.dobEncrypted, profile.dobIv);
        decryptedProfile.dob = decryptPII(dobBlob.ciphertext, dobBlob.iv, dobBlob.tag);
      }
      if (profile.incomeEncrypted) {
        const incomeBlob = fromStorage(profile.incomeEncrypted, profile.incomeIv);
        decryptedProfile.income = Number(decryptPII(incomeBlob.ciphertext, incomeBlob.iv, incomeBlob.tag));
      }
    } catch (err) {
      logger.error({ err, userId: ctx.userId }, "Failed to decrypt profile for eligibility");
    }
  }

  const requirements = {
    eligibilityRequirements: opp.eligibilityRequirements,
    requiredDocuments: opp.requiredDocuments,
  };

  const docsForAI = documents.map((d) => ({
    id: d.id,
    category: d.category,
    documentType: (d.extractedJson as { classification?: { documentType?: string } } | null)
      ?.classification?.documentType ?? d.fileName,
    issueDate: d.issueDate?.toISOString() ?? null,
    expiryDate: d.expiryDate?.toISOString() ?? null,
  }));

  const { system, user } = buildEligibilityPrompt({
    requirements,
    profile: decryptedProfile,
    documents: docsForAI,
  });

  const result = await callAsione<EligibilityResult>(
    [{ role: "system", content: system }, { role: "user", content: user }],
    EligibilityResultSchema,
    { operationId: randomUUID(), temperature: 0.15, maxTokens: 2048 }
  );

  return result.data;
}
