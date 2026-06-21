// src/components/marketing/cta.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function CTA() {
  return (
    <section className="container mx-auto max-w-6xl px-4 py-20">
      <div className="overflow-hidden rounded-3xl border bg-primary p-12 text-center text-primary-foreground">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Ready to stop fighting bureaucracy?</h2>
        <p className="mx-auto mt-3 max-w-xl text-primary-foreground/80">
          Create your secure profile today and let ASI:ONE handle the paperwork.
        </p>
        <Button size="lg" variant="secondary" asChild className="mt-8">
          <Link href="/register">Get started for free</Link>
        </Button>
      </div>
    </section>
  );
}
