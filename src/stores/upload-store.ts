// src/stores/upload-store.ts
import { create } from "zustand";

export interface UploadItem {
  id: string;
  fileName: string;
  status: "uploading" | "processing" | "done" | "error";
  error?: string;
}

interface UploadState {
  items: UploadItem[];
  addItem: (item: UploadItem) => void;
  updateItem: (id: string, updates: Partial<UploadItem>) => void;
  clearItems: () => void;
}

export const useUploadStore = create<UploadState>((set) => ({
  items: [],
  addItem: (item) => set((state) => ({ items: [...state.items, item] })),
  updateItem: (id, updates) => set((state) => ({
    items: state.items.map((it) => (it.id === id ? { ...it, ...updates } : it)),
  })),
  clearItems: () => set({ items: [] }),
}));
