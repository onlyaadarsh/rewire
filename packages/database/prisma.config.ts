import path from "node:path";
import process from "node:process";
import { existsSync } from "node:fs";
import { defineConfig } from "prisma/config";

// Determine which env file to load:
// If PRISMA_ENV is "production" or NODE_ENV is "production", load .env.production
const isProd =
  process.env.PRISMA_ENV === "production" ||
  process.env.NODE_ENV === "production";
const targetEnv = isProd ? ".env.production" : ".env";
const envPath = path.resolve(process.cwd(), targetEnv);

if (existsSync(envPath)) {
  try {
    process.loadEnvFile(envPath);
  } catch (e) {
    console.warn(`[prisma.config.ts] Could not load ${targetEnv}:`, e);
  }
} else {
  const defaultEnvPath = path.resolve(process.cwd(), ".env");
  if (existsSync(defaultEnvPath)) {
    try {
      process.loadEnvFile(defaultEnvPath);
    } catch {
      // ignore
    }
  }
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: process.env.DATABASE_URL,
  },
});
