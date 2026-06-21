// src/types/domain.ts
export type DocumentCategory =
  | "ID_PROOF"
  | "ADDRESS_PROOF"
  | "INCOME_PROOF"
  | "EDUCATION"
  | "RESUME"
  | "PHOTO"
  | "MEDICAL"
  | "FINANCIAL"
  | "OTHER";

export type OpportunityType =
  | "SCHOLARSHIP"
  | "INTERNSHIP"
  | "ADMISSION"
  | "GOVERNMENT_SCHEME"
  | "VISA"
  | "JOB"
  | "OTHER";

export type AnalysisRunType =
  | "DOC_CLASSIFY"
  | "DOC_EXTRACT"
  | "OPPORTUNITY_EXTRACT"
  | "ELIGIBILITY"
  | "MISSING_DOC"
  | "ACTION_PLAN";
