// src/lib/db/queries/opportunities.ts
import { prisma } from "../prisma";

export async function getOpportunityById(id: string, userId: string) {
  return prisma.opportunity.findFirst({
    where: { id, userId, deletedAt: null },
    include: {
      eligibilityReports: { orderBy: { version: "desc" }, take: 1 },
      actionPlans: { orderBy: { version: "desc" }, take: 1, include: { items: { orderBy: { order: "asc" } } } },
      docRequirements: true,
    },
  });
}
