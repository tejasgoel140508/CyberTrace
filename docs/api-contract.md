# API contract

Public endpoints: `GET /api/health` and `POST /api/auth/login` (`{email,password}`). All other API routes need `Authorization: Bearer <token>`.

Authenticated endpoints are dashboard stats; IOC list/detail/search/relationships; Attack DNA list/detail; map threats/country; investigation; reports list/create/detail. IOC list accepts `search`, `type`, `severity`, `page`, and `limit`. Search accepts `{value}`; investigation accepts an URL-encoded IOC parameter.

An investigation consistently includes query, IOC, enrichment, risk, relationships, Attack DNA or null, graph, associated-infrastructure locations, and warnings. Errors use `{error:{code,message}}` with `VALIDATION_ERROR`, `INVALID_IOC`, `UNAUTHORIZED`, and `NOT_FOUND`.
