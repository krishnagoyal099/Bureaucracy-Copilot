// src/lib/db/queries/analysis.ts
import { prisma } from "../prisma";

export async function getAnalysisRuns(userId: string, limit: number = 10) {
  return prisma.analysisRun.findMany({
    where: { userId },
    orderBy: { startedAt: "desc" },
    take: limit,
    include: {
      document: { select: { fileName: true } },
      opportunity: { select: { title: true } },
    },
  });
}

export async function getAnalysisStats(userId: string) {
  const runs = await prisma.analysisRun.groupBy({
    by: ["type"],
    where: { userId, status: "SUCCESS" },
    _count: true,
    _sum: {
      costUsd: true,
      tokensIn: true,
      tokensOut: true,
    },
  });
  return runs;
}
