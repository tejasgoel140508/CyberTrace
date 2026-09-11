import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
export function errorHandler(error: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (error instanceof ZodError) { res.status(400).json({ error: { code: "VALIDATION_ERROR", message: "Request validation failed.", details: error.flatten() } }); return; }
  const message = error instanceof Error ? error.message : "Unexpected error.";
  const status = message === "Invalid IOC format." ? 400 : 500;
  res.status(status).json({ error: { code: status === 400 ? "INVALID_IOC" : "INTERNAL_ERROR", message: status === 400 ? message : "An internal error occurred." } });
}
