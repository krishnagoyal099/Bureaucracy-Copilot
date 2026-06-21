// src/components/dashboard/stat-card.tsx
import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export function StatCard({ icon: Icon, label, value, hint }: {
  icon: LucideIcon; label: string; value: string | number; hint?: string;
}) {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{label}</p>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <p className="mt-2 text-3xl font-bold tracking-tight">{value}</p>
      {hint && <p className={cn("mt-1 text-xs text-muted-foreground")}>{hint}</p>}
    </Card>
  );
}