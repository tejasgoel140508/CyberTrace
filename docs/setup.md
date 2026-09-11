# Local setup

Install Node.js and PostgreSQL locally; Docker is not used. Create database `cybertrace`, copy `.env.example` to `.env`, set `DATABASE_URL` and a strong `JWT_SECRET`, then run `npm ci`, `npm run db:generate`, `npm run db:migrate -- --name initial_schema`, `npm run db:seed`, and `npm run dev:api`.

The API defaults to port 4000. OTX and URLhaus credentials are optional and unavailable providers are skipped safely.
