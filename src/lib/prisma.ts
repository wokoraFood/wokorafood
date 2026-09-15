import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function databaseUrl() {
  if (!process.env.VERCEL) return process.env.DATABASE_URL;
  const tmp = "/tmp/wokora.db";
  const bundled = path.join(process.cwd(), "prisma", "dev.db");
  if (!fs.existsSync(tmp) && fs.existsSync(bundled)) {
    fs.copyFileSync(bundled, tmp);
  }
  return "file:/tmp/wokora.db";
}

const url = databaseUrl();

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: url ? { db: { url } } : undefined,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

globalForPrisma.prisma = prisma;
