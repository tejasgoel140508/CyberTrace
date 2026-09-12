import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
const appRoot = fileURLToPath(new URL(".", import.meta.url));
const repositoryRoot = resolve(appRoot, "../..");
export default defineConfig({ root: appRoot, envDir: repositoryRoot, plugins: [react()], resolve: { alias: { "@cybertrace/shared": resolve(repositoryRoot, "packages/shared/src/index.ts") } } });
