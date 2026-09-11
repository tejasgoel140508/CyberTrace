# Database

The Prisma schema is authoritative. `User` owns `Report`. `IOC` has directed `IOCRelationship` records, AttackProfile membership, and associated `Location` membership. `AttackProfile` joins to `Technique`; reports can reference an IOC or profile.

Seeded records are `isDemo=true` and include `DEMO_SEED`; live evidence is never synthesized from them.
