// src/config/site.ts
export const siteConfig = {
  name: "Bureaucracy Copilot",
  description: "Upload documents once. Apply everywhere.",
  url: process.env.NEXTAUTH_URL ?? "http://localhost:3000",
};
