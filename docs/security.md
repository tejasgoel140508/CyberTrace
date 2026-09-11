# Security and limitations

Passwords use bcrypt and sessions use expiring JWTs. Helmet, CORS restricted to `FRONTEND_ORIGIN`, rate limiting, Zod validation, centralized errors, and Prisma queries protect the API. Secrets stay in environment variables and are never returned.

Threat feeds can be stale or false-positive; feed absence does not prove safety. IP geolocation identifies associated infrastructure, not a physical attacker. Infrastructure location is not attribution, correlation is not definitive attribution, and seeded data is synthetic. CyberTrace is a hackathon prototype, not a production SOC platform.
