// src/lib/db/queries/documents.ts
import { prisma } from "../prisma";

export async function getDocumentById(id: string, userId: string) {
  return prisma.document.findFirst({
    where: { id, userId, deletedAt: null },
  });
}

export async function getDocumentsByUserId(userId: string) {
  return prisma.document.findMany({
    where: { userId, deletedAt: null },
    orderBy: { uploadedAt: "desc" },
  });
}
