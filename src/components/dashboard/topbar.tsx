// src/components/dashboard/topbar.tsx
"use client";
import { usePathname } from "next/navigation";
import { Bell, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const TITLES: Record<string, string> = {
  "/dashboard": "Overview",
  "/documents": "Document Vault",
  "/opportunities": "Opportunities",
  "/settings": "Settings",
};

export function Topbar({ user }: { user: { name?: string | null } }) {
  const pathname = usePathname();
  const title = Object.entries(TITLES).find(([k]) => pathname.startsWith(k))?.[1] ?? "Dashboard";
  return (
    <header className="glass sticky top-0 z-30 flex h-16 items-center gap-4 px-4 md:px-8">
      <h1 className="text-lg font-semibold">{title}</h1>
      <div className="ml-auto flex items-center gap-2">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search…" className="h-9 w-64 pl-9" />
        </div>
        <Button variant="ghost" size="icon"><Bell className="h-4 w-4" /></Button>
        <div className="grid h-9 w-9 place-items-center rounded-full bg-primary text-primary-foreground text-sm font-semibold">
          {(user.name ?? "U").slice(0, 1).toUpperCase()}
        </div>
      </div>
    </header>
  );
}
