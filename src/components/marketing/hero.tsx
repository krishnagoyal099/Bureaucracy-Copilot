// src/components/marketing/hero.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, FileCheck2, Sparkles, ShieldCheck } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="container mx-auto max-w-6xl px-4 py-24 md:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <Badge variant="secondary" className="mb-6 gap-1.5 py-1.5">
            <Sparkles className="h-3.5 w-3.5" /> Powered by ASI:ONE reasoning
          </Badge>
          <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-6xl md:text-7xl">
            Upload documents once. <span className="gradient-text">Apply everywhere.</span>
          </h1>
          <p className="mt-6 text-pretty text-lg text-muted-foreground md:text-xl">
           Navigating bureaucracy shouldn&apos;t be a full-time job. AI automatically tracks your documents, checks eligibility, and plans your next move.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button size="lg" asChild className="gap-2">
              <Link href="/register">Start free <ArrowRight className="h-4 w-4" /></Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/login">Sign in</Link>
            </Button>
          </div>
          <div className="mt-12 flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5"><ShieldCheck className="h-4 w-4" /> Encrypted at rest</span>
            <span className="flex items-center gap-1.5"><FileCheck2 className="h-4 w-4" /> SOC2-ready</span>
          </div>
        </div>
      </div>
      <div className="pointer-events-none absolute inset-x-0 -top-40 -z-10 h-[40rem] bg-gradient-to-b from-primary/5 to-transparent blur-3xl" />
    </section>
  );
}
