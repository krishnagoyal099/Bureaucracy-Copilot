// src/components/marketing/how-it-works.tsx
import { Upload, BrainCircuit, ClipboardCheck, Send } from "lucide-react";

const STEPS = [
  { icon: Upload, title: "1. Upload Documents", desc: "Securely upload your IDs, certificates, and resumes to your encrypted vault." },
  { icon: BrainCircuit, title: "2. Analyze Opportunity", desc: "Paste a link or upload a PDF of the scholarship, internship, or scheme." },
  { icon: ClipboardCheck, title: "3. Verify Eligibility", desc: "ASI:ONE reasons through the requirements and tells you exactly where you stand." },
  { icon: Send, title: "4. Execute Action Plan", desc: "Follow the prioritized checklist to close gaps and submit your application." },
];

export function HowItWorks() {
  return (
    <section className="bg-muted/30 py-20">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">How it works</h2>
          <p className="mt-3 text-muted-foreground">From chaos to clarity in four steps.</p>
        </div>
        <div className="grid gap-8 md:grid-cols-4">
          {STEPS.map((s) => (
            <div key={s.title} className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <s.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mt-4 font-semibold">{s.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
