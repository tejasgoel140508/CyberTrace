# Database

The Prisma schema is authoritative. `User` owns `Report` and `InvestigationCase` records. An investigation case optionally references an `IOC` and persists its title, status, verdict, notes, and audit timestamps. `IOC` has directed `IOCRelationship` records, joins to `AttackProfile` through `AttackProfileIOC`, and joins to `Location` through `IOCLocation`. `AttackProfile` joins MITRE-style `Technique` records through `AttackProfileTechnique`. Reports optionally reference an IOC and AttackProfile and retain server-generated JSON content.

Seeded IOC and profile records are marked `isDemo` and use `DEMO_SEED`; they are synthetic, not live intelligence.
