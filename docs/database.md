# Database

The Prisma schema is authoritative and unchanged. `User` owns `Report` records. `IOC` has directed `IOCRelationship` records, joins to `AttackProfile` through `AttackProfileIOC`, and joins to `Location` through `IOCLocation`. `AttackProfile` joins MITRE-style `Technique` records through `AttackProfileTechnique`. Reports optionally reference an IOC and AttackProfile and retain server-generated JSON content.

Seeded IOC and profile records are marked `isDemo` and use `DEMO_SEED`; they are synthetic, not live intelligence.
