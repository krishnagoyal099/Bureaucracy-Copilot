// src/app/api/uploadthing/core.ts
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { auth } from "@/lib/auth/config";
import { z } from "zod";

const f = createUploadthing();

const authenticate = async () => {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  return { userId: session.user.id };
};

export const uploadRouter = {
  documentUploader: f({
    pdf: { maxFileSize: "16MB" },
    image: { maxFileSize: "16MB" },
  })
    .middleware(async () => authenticate())
    .onUploadComplete(async ({ metadata, file }) => ({
      userId: metadata.userId,
      uploadThingKey: file.key,
      mimeType: file.type,
    })),

  opportunityUploader: f({
    pdf: { maxFileSize: "32MB" },
    image: { maxFileSize: "32MB" },
  })
    .input(z.object({ title: z.string(), type: z.string() }))
    .middleware(async ({ input }) => ({ ...await authenticate(), input }))
    .onUploadComplete(async ({ metadata, file }) => ({
      userId: metadata.userId,
      uploadThingKey: file.key,
      mimeType: file.type,
      title: metadata.input.title,
    })),
} satisfies FileRouter;

export type AppFileRouter = typeof uploadRouter;
