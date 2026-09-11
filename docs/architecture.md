# CyberTrace architecture

CyberTrace is a local hackathon prototype: React/Vite calls an Express API, which persists investigation evidence in local PostgreSQL through Prisma. The API validates and normalizes an IOC, uses stored demo evidence or optional provider evidence, calculates transparent risk, correlates stored relationships, and returns Attack DNA, graph nodes, associated-infrastructure markers, and report content.

Providers are optional and isolated; unavailable feeds become warnings, never fabricated intelligence. The risk engine uses only five documented signals. Attack DNA is seeded synthetic evidence or remains absent for unsupported live evidence. No Docker, cloud database, queue, or external deployment is required.
