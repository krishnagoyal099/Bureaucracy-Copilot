<div align="center">
  <img src="public/logo.svg" alt="FormMitra Logo" width="120" />

  # FormMitra
  ### The Personal AI Bureaucracy Copilot 

  [![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
  [![Prisma](https://img.shields.io/badge/Prisma-ORM-1B222D?style=for-the-badge&logo=prisma)](https://prisma.io/)
  [![ASI:ONE](https://img.shields.io/badge/AI-ASI:ONE-6366f1?style=for-the-badge)](https://asi1.ai/)
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

  > Stop losing life-changing opportunities to confusing PDFs and missed deadlines. FormMitra automates the hardest parts of bureaucracy.
</div>

---

## The Problem
Every year, millions of students and citizens miss out on scholarships, government schemes, and visas. Not because they aren't qualified, but because the **bureaucratic friction** is too high. 
- You have to read 30-page PDFs filled with legal jargon.
- You have to guess if your specific income or age makes you eligible.
- You scramble to find your Aadhaar, PAN, or marksheets at the last second.

## The FormMitra Solution
FormMitra is not just a form-filler. It is an **accessible legal/bureaucratic consultant**. You upload a PDF or paste a website link, and the AI handles the heavy lifting—analyzing your eligibility, building a step-by-step action plan, and cross-referencing your securely encrypted document vault.

## Platform Preview

<div align="center">
  <img src="public/og.png" alt="Platform Preview" width="800" style="border-radius: 8px; border: 1px solid #333;" />
</div>

---

## Core Capabilities

### 1. AI Eligibility Engine (Powered by ASI:ONE)
Never guess if you qualify again. FormMitra's AI extracts the exact requirements from any scholarship or scheme (via PDF or URL) and cross-references them against your personal profile. It provides a nuanced AI-generated eligibility assessment with detailed reasoning and confidence indicators.

### 2. Encrypted Document Vault (AES-256-GCM)
Your sensitive data (Income, DOB, Aadhaar) is encrypted locally before it ever touches the database. Upload your critical documents once, let the AI automatically categorize them, and reuse them for life.

### 3. Smart Action Plans & Missing Document Detection
FormMitra builds a prioritized, step-by-step checklist for every opportunity. It actively scans your vault and flags exactly which documents you are missing (e.g., "Your Income Certificate is older than 6 months").

### 4. Automated Deadline Reminders
Background CRON jobs actively track your opportunities and dispatch beautifully rendered HTML emails (via React Email + Nodemailer) to warn you at 3 days, 1 day, and 0 days before a deadline expires.

### 5. Native Bilingual Support (i18n)
Bureaucracy doesn't only speak English. FormMitra features flawless, out-of-the-box localization switching between **English** and **Hindi**.

### 6. Performance & Capabilities
- **Processing Power:** Analyzes complex application PDFs or directly crawls full web pages.
- **Accuracy Constraints:** Built with "Refusal" fallback mechanisms to prevent hallucinations if requirements are ambiguous.
- **Speed:** Average complete analysis time of `<15 seconds` per opportunity.
- **Vault Intelligence:** Auto-categorizes Aadhaar, PAN, Passports, Transcripts, Income Certificates, and Resumes.

---

## System Architecture

```mermaid
graph TD
    A[Encrypted Vault Data] --> C{ASI:ONE Inference Engine}
    B[PDF or URL Input] --> C
    C -->|Extracts Rules| D[Cross-Reference Analysis]
    D --> E[Eligibility Report]
    D --> F[Smart Action Plan & Gap Detection]
    F --> G[Daily Cron Deadline Notifier]
```

---

## Architecture & Tech Stack

FormMitra is built on a modern, deeply typed, and blazingly fast stack.

- **Framework:** Next.js 15 (App Router, Server Actions)
- **Database:** PostgreSQL (via Prisma ORM)
- **Authentication:** NextAuth.js v5
- **AI Intelligence:** ASI:ONE LLM API (`as1-gemini-2.5-flash-pro`)
- **Styling & UI:** Tailwind CSS, Radix UI, Framer Motion, Lucide Icons
- **Email:** Nodemailer & `@react-email/components`
- **Security:** Native Node.js `crypto` (AES-256-GCM Encryption at rest)
- **Internationalization:** `next-intl`

---

## Getting Started

Worthy in the eyes of men, and runnable by mere mortals.

### 1. Clone the Repository
```bash
git clone https://github.com/krishnagoyal099/Bureaucracy-Copilot.git
cd Bureaucracy-Copilot
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Duplicate the `.env.example` file to `.env` and fill in your keys:
```env
# Database
DATABASE_URL="postgresql://user:pass@localhost:5432/formmitra"

# Auth
AUTH_SECRET="generate-a-random-32-char-string"

# AI
ASIONE_API_KEY="your-asi-one-key"

# Email
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="your-app-password"

# Encryption (MUST BE EXACTLY 32 CHARS)
ENCRYPTION_KEY="your-32-character-secret-key-here"
```

### 4. Setup the Database
Generate the Prisma client and push the schema to your database.
```bash
npx prisma generate
npx prisma db push
```

### 5. Ignite the Engines
```bash
npm run dev
```
Visit `http://localhost:3000` to witness the bureaucracy copilot in action.

---

## Security Note
FormMitra takes privacy seriously. PII (Personally Identifiable Information) such as Full Name, Date of Birth, and Income are encrypted at the application layer using AES-256-GCM before being stored in PostgreSQL. Even with direct database access, your data remains secure.

---

<div align="center">
  <i>"Bureaucracy is a giant mechanism operated by pygmies." — Honoré de Balzac</i><br/>
  <b>Let FormMitra level the playing field.</b>
</div>
