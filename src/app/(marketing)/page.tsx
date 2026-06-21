// src/app/(marketing)/page.tsx
import Link from "next/link";
import { Hero } from "@/components/marketing/hero";
import { FeatureGrid } from "@/components/marketing/feature-grid";
import { HowItWorks } from "@/components/marketing/how-it-works";
import { CTA } from "@/components/marketing/cta";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <main className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 glass">
        <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <span className="grid h-7 w-7 place-items-center rounded-md bg-primary text-primary-foreground text-xs font-bold">BC</span>
            Bureaucracy Copilot
          </Link>
          <nav className="flex items-center gap-2">
            <Button variant="ghost" asChild><Link href="/login">Sign in</Link></Button>
            <Button asChild><Link href="/register">Get started</Link></Button>
          </nav>
        </div>
      </header>
      <Hero />
      <FeatureGrid />
      <HowItWorks />
      <CTA />
      <footer className="border-t py-6 text-center text-sm text-muted-foreground">
        Built for Hack-A-Agent · Powered by ASI:ONE
      </footer>
    </main>
  );
}