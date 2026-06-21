// src/hooks/use-upload-documents.ts
"use client";
import { useUploadThing } from "@/lib/storage/uploadthing";
import { useUploadStore } from "@/stores/upload-store";

export function useUploadDocuments() {
  const { startUpload, isUploading } = useUploadThing("documentUploader");
  const { items, addItem, updateItem, clearItems } = useUploadStore();

  const upload = async (files: File[]) => {
    for (const file of files) {
      const id = crypto.randomUUID();
      addItem({ id, fileName: file.name, status: "uploading" });
      
      try {
        const uploaded = await startUpload([file]);
        if (!uploaded?.[0]) throw new Error("Upload failed");
        
        updateItem(id, { status: "processing" });
        
        // Simulate server processing delay for UI feedback
        await new Promise((r) => setTimeout(r, 1500));
        
        updateItem(id, { status: "done" });
      } catch (err) {
        updateItem(id, { status: "error", error: (err as Error).message });
      }
    }
  };

  return { upload, isUploading, items, clearItems };
}
