# CyberTrace

> From Indicators to Intelligence.

CyberTrace is a local cybersecurity threat-intelligence and investigation application built for a hackathon. It turns an indicator of compromise (IOC) into evidence-led investigation context while keeping live intelligence and synthetic demonstrations clearly separate.

## Problem and objective

An analyst often starts with an isolated IP address, domain, URL, or file hash and must decide what it means. CyberTrace connects validation, provider evidence, normalization, transparent risk scoring, IOC correlation, Attack DNA, relationship graphs, geographic infrastructure context, investigations, and reports into one local workflow. Its objective is to make those connections inspectable—not to claim attribution beyond the available evidence.

## Intelligence model

| Layer | Question | Meaning |
| --- | --- | --- |
| IOC Intelligence | What? | Indicator reputation, observations, evidence, and risk. |
| Attack DNA | How? | Techniques, delivery, command-and-control, and related behavior. |
| Associated Infrastructure Map | Where? | Observed or associated infrastructure locations only. |

Supported IOC types are IPv4, IPv6, domain, HTTP/HTTPS URL, MD5, SHA-1, and SHA-256.

## Workflow and features

`IOC → validation → enrichment → normalization → risk scoring → correlation → Attack DNA → graph/map → investigation → report`

Core views include a dashboard, IOC explorer and details, evidence-based risk display, Attack DNA profiles, relationship graph, map, and reports. The risk and correlation rules are deterministic and tested, so their outcomes can be explained to an analyst.

## Architecture and ownership

This repository uses one root npm package and PostgreSQL with Prisma. The React/Vite frontend lives under `apps/web`; the Express API lives under `apps/api`; both are owned by the application engineers. Foundation ownership is limited to root setup files, `prisma/**`, and `tests/**`. No Docker, deployment, cloud database, or hosted service is required.

Technology: Node.js, TypeScript, React, Vite, Tailwind CSS, React Router, Express, Zod, PostgreSQL, Prisma, bcryptjs, jsonwebtoken, Helmet, CORS, rate limiting, React Flow, React Leaflet, Recharts, Vitest, Supertest, Testing Library, jsdom, and concurrently.

## Local setup

PostgreSQL is required for the running application. Create a local database named `cybertrace`; PostgreSQL is the only supported datastore.

```powershell
npm install
Copy-Item .env.example .env
# Edit DATABASE_URL with your local PostgreSQL password
npm run db:generate
npm run db:migrate -- --name initial_schema
npm run db:seed
```

The default connection format is `postgresql://postgres:YOUR_PASSWORD@localhost:5432/cybertrace?schema=public`. Do not commit `.env` or API keys.

Environment variables:

- `DATABASE_URL`: local PostgreSQL connection string.
- `PORT`: API port (default `4000`).
- `FRONTEND_ORIGIN`: allowed browser origin (default `http://localhost:5173`).
- `JWT_SECRET`: long local secret for authenticated sessions.
- `VITE_API_BASE_URL`: frontend API base (default `http://localhost:4000/api`).
- `ENABLE_EXTERNAL_ENRICHMENT`: enables configured provider lookups.
- `OTX_API_KEY` and `URLHAUS_AUTH_KEY`: optional provider credentials.

Provider credentials are optional. With blank keys, CyberTrace still works using demonstration data. Live IOC responses must use only returned provider evidence. Insufficient malicious evidence remains `UNKNOWN`; the application must never invent malware, campaigns, related indicators, identities, or locations.

## Commands

```powershell
npm run dev          # API :4000 and web :5173
npm run dev:api
npm run dev:web
npm run build
npm run typecheck
npm test
npm run test:backend
npm run test:frontend
npm run db:studio
```

Expected URLs are `http://localhost:5173` for the frontend and `http://localhost:4000` for the API.

## Demonstration data

`npm run db:seed` provisions the local demo analyst:

- Email: `analyst@cybertrace.local`
- Password: `CyberTrace123!`

It also creates three explicitly synthetic Attack DNA clusters: Credential Phishing, Ransomware Infrastructure, and Malware Command-and-Control. Every seeded IOC has `isDemo = true` and includes `DEMO_SEED` in its sources. They use `.test` domains and documentation-network IP addresses; seeded hashes are valid-format synthetic values, not claimed real malware samples.

The UI must label **DEMO** separately from **LIVE** intelligence. An associated infrastructure location is not an attacker location. Correlation indicates evidence overlap, not identity, causation, or attribution. Geolocation can be approximate, stale, and infrastructure-specific.

## Limitations

This is a local hackathon prototype. Provider coverage, reputation freshness, IP location, and relationship data depend on evidence actually available to configured providers. Scores are decision aids, not verdicts. Analysts must independently verify material findings and should not treat correlation as attribution.

## Suggested demonstration sequence

1. Sign in with the demo analyst and open the dashboard.
2. Explore a `DEMO_SEED` IOC such as `login-m365-secure.test`.
3. Inspect evidence, risk reasons, the relationship graph, and associated infrastructure map.
4. Open its Attack DNA cluster and its techniques.
5. Create or view an investigation report, emphasizing the DEMO label and attribution disclaimer.
6. Search a live IOC to show that no evidence produces an `UNKNOWN` result rather than fabricated intelligence.

## Clean-clone checklist

1. Clone the repository and install Node.js/npm and PostgreSQL locally.
2. Run `npm install`.
3. Copy `.env.example` to `.env` and set local database credentials and a JWT secret.
4. Create the `cybertrace` PostgreSQL database if needed.
5. Generate Prisma, run the initial migration, and seed data using the commands above.
6. Run tests, then start `npm run dev`.

## Screenshots

Screenshots placeholder: dashboard, IOC detail/risk view, Attack DNA graph, infrastructure map, and report view.
