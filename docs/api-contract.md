# API contract

Public: `GET /api/health`; `POST /api/auth/login` with `{ email, password }`. All other endpoints require `Authorization: Bearer <token>`.

Endpoints: `GET /dashboard/stats`, `GET /iocs?search&type&severity&page&limit`, `GET /iocs/:id`, `POST /iocs/search` (`{value,refresh?}`), `GET /iocs/:id/relationships`, `GET /attack-dna`, `GET /attack-dna/:id`, `GET /map/threats`, `GET /map/country/:country`, `GET /investigate/:ioc?refresh=true`, `GET /cases`, `POST /cases` (`{iocId,title?}`), `PATCH /cases/:id` (`{title?,status?,verdict?,notes?}`), `GET /reports`, `POST /reports` (`{iocId?,attackProfileId?,title?}`), and `GET /reports/:id`.

Cases are owned by the authenticated user. Analysts and administrators can create and update them; all signed-in users can view only their own cases.

Search and investigate return `InvestigationResponse`: query, generatedAt, `dataMode` (`DEMO` or `LIVE`), IOC summary, normalized enrichment/provider summary, transparent risk/reasons, relationships, nullable Attack DNA, `{nodes,edges}` graph, associated-infrastructure locations, and warnings. Live results expose only normalized provider evidence/status (`SUCCESS`, `NO_DATA`, `SKIPPED`, `ERROR`, `RATE_LIMITED`), never provider raw payloads or credentials. Live IOC data is cached for 15 minutes unless `refresh=true` is supplied. Errors are `{error:{code,message}}`, including `INVALID_IOC`, `VALIDATION_ERROR`, `UNAUTHORIZED`, and `NOT_FOUND`.
