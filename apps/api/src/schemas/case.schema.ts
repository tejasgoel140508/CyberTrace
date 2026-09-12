import { z } from "zod";

export const caseStatusSchema = z.enum(["OPEN", "MONITORING", "ESCALATED", "CLOSED"]);
export const caseVerdictSchema = z.enum(["PENDING_REVIEW", "MALICIOUS", "SUSPICIOUS", "BENIGN", "INSUFFICIENT_EVIDENCE"]);

export const createCaseSchema = z.object({
  iocId: z.string().min(1),
  title: z.string().trim().min(1).max(200).optional(),
});

export const updateCaseSchema = z.object({
  title: z.string().trim().min(1).max(200).optional(),
  status: caseStatusSchema.optional(),
  verdict: caseVerdictSchema.optional(),
  notes: z.string().max(10_000).optional(),
}).refine(value => Object.values(value).some(item => item !== undefined), "At least one case field is required.");
