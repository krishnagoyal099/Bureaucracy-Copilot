// src/components/marketing/feature-grid.tsx
import { FileSearch, ListChecks, ShieldCheck, CalendarClock, FileText, Brain } from "lucide-react";

const FEATURES = [
  { icon: FileSearch, title: "Smart document extraction", desc: "PDFs, images, certificates — categorized and structured automatically." },
  { icon: Brain, title: "ASI:ONE eligibility reasoning", desc: "A real reasoning engine compares your profile to opportunity criteria." },
  { icon: ListChecks, title: "Missing-doc detection", desc: "Know exactly what's missing and how to obtain it." },
  { icon: CalendarClock, title: "Deadline-aware plans", desc: "Prioritized action items with effort and time-to-ready estimates." },
  { icon: FileText, title: "One profile, many applications", desc: "Reuse your verified document vault across scholarships, internships, visas." },
  { icon: ShieldCheck, title: "Encrypted & private", desc: "PII encrypted at rest with AES-256-GCM. You control access." },
];

export function FeatureGrid() {
  return (
    <section className="container mx-auto max-w-6xl px-4 py-20">
      <div className="mx-auto mb-12 max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Everything you need to apply, faster</h2>
        <p className="mt-3 text-muted-foreground">From scattered paperwork to a single source of truth.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((f) => (
          <div key={f.title} className="card-hover rounded-xl border bg-card p-6">
            <f.icon className="h-6 w-6 text-foreground" />
            <h3 className="mt-4 font-semibold">{f.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}