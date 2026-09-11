import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
export type AuthRequest = Request & { user?: { id: string; email: string; name: string } };
export function authenticate(req: AuthRequest, res: Response, next: NextFunction) {
  const token = req.header("authorization")?.replace(/^Bearer\s+/i, "");
  if (!token) { res.status(401).json({ error: { code: "UNAUTHORIZED", message: "Authentication is required." } }); return; }
  try { req.user = jwt.verify(token, env.jwtSecret) as AuthRequest["user"]; next(); } catch { res.status(401).json({ error: { code: "UNAUTHORIZED", message: "Invalid or expired token." } }); }
}
