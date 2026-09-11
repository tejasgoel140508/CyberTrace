# CyberTrace architecture

CyberTrace runs locally: the Vite frontend calls the Express API, which uses PostgreSQL through Prisma. The API validates and normalizes IOCs, loads stored synthetic evidence or configured provider evidence, calculates transparent risk/correlation, and produces Attack DNA, graphs, map markers, and reports.

Attack DNA uses stored AttackProfile and Technique relations. Map coordinates describe associated infrastructure, never attacker locations. External providers are optional and failures become warnings.

CyberTrace is a hackathon prototype, not a production SOC platform. Feed data may be stale or false-positive; absence does not prove safety; correlation is not attribution.
