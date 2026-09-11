import "dotenv/config";

export const env = {
  port: Number(process.env.PORT ?? 4000),
  frontendOrigin: process.env.FRONTEND_ORIGIN ?? "http://localhost:5173",
  jwtSecret: process.env.JWT_SECRET || "cybertrace-local-development-secret",
  externalEnrichment: process.env.ENABLE_EXTERNAL_ENRICHMENT === "true",
  otxApiKey: process.env.OTX_API_KEY,
  urlhausAuthKey: process.env.URLHAUS_AUTH_KEY,
};

export function requireDatabaseUrl() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required for database operations.");
  return process.env.DATABASE_URL;
}
