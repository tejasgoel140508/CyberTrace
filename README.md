# CyberTrace

From Indicators to Intelligence.

CyberTrace is a local cybersecurity threat-intelligence and investigation prototype built for a hackathon. It turns an indicator of compromise (IOC) into transparent evidence, correlation, Attack DNA, associated infrastructure context, and a shareable investigation report.

## Purpose

Security analysts often have isolated IPs, domains, URLs, and hashes but need a fast way to understand the evidence around them. CyberTrace focuses on the investigation path:

`IOC → validation → enrichment → normalization → risk scoring → correlation → Attack DNA → graph → associated infrastructure map → investigation → report`

It supports IPv4, IPv6, domains, HTTP/HTTPS URLs, MD5, SHA-1, and SHA-256 indicators.

The product vocabulary is deliberately scoped: **WHAT** is IOC intelligence, **HOW** is Attack DNA (techniques and behavior), and **WHERE** is associated/observed infrastructure context. WHERE is never confirmation of an attacker’s physical location.

## Features and architecture

The React/Vite interface provides dashboard, IOC explorer/details, risk display, Attack DNA, relationship graph, infrastructure map, and reports. The Express API owns validation, authentication, transparent scoring, correlation, enrichment adapters, and PostgreSQL persistence through Prisma. React Flow powers the graph, React Leaflet the map, and Recharts visualizations.

The root project uses one npm package (no workspaces). Foundation-owned files are root configuration, `prisma/**`, and `tests/**`; API files under `apps/api/**` and web files under `apps/web/**` are owned by the other project contributors.

## Live intelligence versus demo data

CyberTrace never invents intelligence for real IOCs. Live searches must use only returned provider evidence; insufficient malicious evidence must remain `UNKNOWN`. It must not fabricate malware, campaigns, relationships, attacker identity, or location.

The seed contains clearly synthetic Attack DNA scenarios: Credential Phishing Cluster, Ransomware Infrastructure Cluster, and Malware Command-and-Control Cluster. Every seeded IOC has `isDemo: true` and `DEMO_SEED` in `sources`. They use `.test` domains and documentation-network IPs only. UI and reports should label this distinction prominently.

Optional external providers are enabled only when configured. Empty API keys leave the app fully usable with local demo data. Never commit credentials or put live credentials in client-side variables.

## Local setup

CyberTrace requires a locally running PostgreSQL server; Docker and cloud databases are intentionally not used. Create a database named `cybertrace`, then copy `.env.example` to `.env` and replace `YOUR_PASSWORD` in `DATABASE_URL`.

```bash
npm install
npm run db:generate
npx prisma validate
npm run db:migrate
npm run db:seed
```

For a clean clone, install Node.js and PostgreSQL, create the local database, create `.env` from `.env.example`, then run the commands above. No external threat-intelligence key is needed for the seeded demonstration.

Environment variables:

- `DATABASE_URL` — local PostgreSQL connection string.
- `PORT` — API port (default `4000`).
- `FRONTEND_ORIGIN` — CORS origin (`http://localhost:5173`).
- `JWT_SECRET` — long, local-only signing secret.
- `VITE_API_BASE_URL` — browser API endpoint.
- `ENABLE_EXTERNAL_ENRICHMENT`, `OTX_API_KEY`, `URLHAUS_AUTH_KEY` — optional enrichment configuration.

## Development and verification

```bash
npm run dev          # API on http://localhost:4000 and web on http://localhost:5173
npm run build
npm run typecheck
npm test
npm run test:backend
npm run test:frontend
npm run db:studio
```

The demo analyst is `analyst@cybertrace.local` with password `CyberTrace123!`. The seed stores only a bcrypt hash, never the plaintext password.

Risk scoring is explainable and evidence-based: malicious reputation (+30), at least two sources (+20), recent activity (+15), malware association (+20), and campaign association (+15), capped at 100. Correlation is likewise evidence-based and not attribution.

## Limitations and safe interpretation

Geographic markers indicate associated infrastructure observations, not attacker geolocation. Shared infrastructure, techniques, hashes, or campaigns are investigation leads, not proof of a common operator. Provider coverage and availability determine live result quality.

Suggested hackathon flow: sign in as the demo analyst; open a clearly labelled synthetic IOC; inspect its evidence and score; follow graph relationships into the Attack DNA profile; view associated infrastructure map markers; and create/export a report that retains the demo and attribution disclaimers.

## Screenshots

_Screenshots will be added as the web interface is completed._
