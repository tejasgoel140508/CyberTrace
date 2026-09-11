# API contract

Public: `GET /api/health`; `POST /api/auth/login` with `{ email, password }`. All other endpoints require `Authorization: Bearer <token>`.

Endpoints: `GET /dashboard/stats`, `GET /iocs?search&type&severity&page&limit`, `GET /iocs/:id`, `POST /iocs/search` (`{value}`), `GET /iocs/:id/relationships`, `GET /attack-dna`, `GET /attack-dna/:id`, `GET /map/threats`, `GET /map/country/:country`, `GET /investigate/:ioc`, `GET /reports`, `POST /reports` (`{iocId?,attackProfileId?,title?}`), and `GET /reports/:id`.

Search and investigate return `InvestigationResponse`: query, generatedAt, IOC summary, normalized enrichment/provider summary, transparent risk/reasons, relationships, nullable Attack DNA, `{nodes,edges}` graph, associated-infrastructure locations, and warnings. Errors are `{error:{code,message}}`, including `INVALID_IOC`, `VALIDATION_ERROR`, `UNAUTHORIZED`, and `NOT_FOUND`.
