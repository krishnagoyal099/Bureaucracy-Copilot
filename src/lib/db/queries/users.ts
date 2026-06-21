// src/lib/db/queries/users.ts
import { prisma } from "../prisma";
import { Profile } from "@prisma/client";

export async function getUserProfile(userId: string): Promise<Profile | null> {
  return prisma.profile.findUnique({
    where: { userId },
  });
}

export async function getDashboardMetrics(userId: string) {
  const [docCount, oppCount, planCount, recentOpps] = await Promise.all([
    prisma.document.count({ where: { userId, deletedAt: null } }),
    prisma.opportunity.count({ where: { userId, deletedAt: null } }),
    prisma.actionPlan.count({ where: { userId } }),
    prisma.opportunity.findMany({
      where: { userId, deletedAt: null },
      include: { actionPlans: { orderBy: { version: "desc" }, take: 1 } },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  const avgReadiness = recentOpps.flatMap(o => o.actionPlans).reduce((acc, plan) => acc + plan.readinessScore, 0) / (recentOpps.length || 1);

  return {
    docCount,
    oppCount,
    planCount,
    recentOpps,
    avgReadiness: Math.round(avgReadiness),
  };
}
