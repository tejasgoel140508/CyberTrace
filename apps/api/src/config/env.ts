import "dotenv/config";

const bool = (value: string | undefined) => value === "true";
export const env = {
  port: Number(process.env.PORT ?? 4000),
  frontendOrigin: process.env.FRONTEND_ORIGIN ?? "http://localhost:5173",
  jwtSecret: process.env.JWT_SECRET ?? "cybertrace-local-development-secret",
  externalEnrichment: bool(process.env.ENABLE_EXTERNAL_ENRICHMENT),
  otxApiKey: process.env.OTX_API_KEY,
  urlhausAuthKey: process.env.URLHAUS_AUTH_KEY,
};
