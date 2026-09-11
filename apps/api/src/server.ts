import app from "./app";
import { env } from "./config/env";
import { prisma } from "./config/prisma";
const server = app.listen(env.port, () => console.log(`CyberTrace API listening on ${env.port}`));
const shutdown = () => server.close(() => prisma.$disconnect().finally(() => process.exit(0)));
process.on("SIGINT", shutdown); process.on("SIGTERM", shutdown);
