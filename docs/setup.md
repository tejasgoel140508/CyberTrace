# Local setup

Install Node.js and PostgreSQL, create a local `cybertrace` database, copy `.env.example` to `.env`, and set a real local `DATABASE_URL` and `JWT_SECRET`.

```bash
npm ci
npm run db:generate
npm run db:migrate
npm run db:seed
npm run dev:api
```

The API listens on port 4000 by default; the web client uses port 5173. Optional OTX/URLhaus keys can remain empty. No Docker is used.
