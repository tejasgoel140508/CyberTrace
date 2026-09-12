# Security and limitations

Passwords are bcrypt hashes and protected API routes use expiring JWTs. Helmet, CORS restricted to `FRONTEND_ORIGIN`, rate limiting, Zod request validation, Prisma queries, and centralized safe errors reduce common local prototype risks. Secrets are never returned by the API.

Threat feeds may be stale or contain false positives; absence from a feed does not prove safety. Correlation is not definitive attribution. IP geolocation and infrastructure markers do not identify a physical attacker. Seeded data is synthetic. CyberTrace is a hackathon prototype, not a production SOC platform.
