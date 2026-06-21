// src/hooks/use-toast.ts
"use client";
import { useState, useCallback, useEffect } from "react";

export interface Toast {
  id: string;
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
}

let toastCount = 0;
const listeners = new Set<(toasts: Toast[]) => void>();
let memoryToasts: Toast[] = [];

function dispatch(toasts: Toast[]) {
  memoryToasts = toasts;
  listeners.forEach((l) => l(toasts));
}

export function toast(t: Omit<Toast, "id">) {
  const id = `toast-${++toastCount}`;
  dispatch([...memoryToasts, { ...t, id }]);
  setTimeout(() => {
    dispatch(memoryToasts.filter((x) => x.id !== id));
  }, 5000);
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>(memoryToasts);

  // Subscribe AFTER mount, not during render, to avoid "state update on
  // unmounted component" errors when toast() fires before the Toaster mounts.
  useEffect(() => {
    // Sync any toasts that fired between first render and mount
    setToasts(memoryToasts);
    listeners.add(setToasts);
    return () => {
      listeners.delete(setToasts);
    };
  }, []);

  const dismiss = useCallback((id: string) => {
    dispatch(memoryToasts.filter((x) => x.id !== id));
  }, []);

  return { toasts, toast, dismiss };
}
