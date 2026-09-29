import { readFileSync } from "fs";
import { resolve } from "path";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

function loadEnv() {
  try {
    const file = resolve(process.cwd(), ".env");
    const text = readFileSync(file, "utf8");
    for (const line of text.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq < 1) continue;
      const key = trimmed.slice(0, eq).trim();
      let value = trimmed.slice(eq + 1).trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      if (!process.env[key]) process.env[key] = value;
    }
  } catch {
    // Host already injected env (Docker / VPS)
  }
}

loadEnv();

const prisma = new PrismaClient();

async function main() {
  await prisma.store.upsert({
    where: { id: "wokora" },
    update: { name: "Wokora Foods" },
    create: { id: "wokora", slug: "wokora", name: "Wokora Foods" },
  });

  const demoPhones = ["9999999999", "9876543210"];
  const demoUsers = await prisma.user.findMany({
    where: { phone: { in: demoPhones } },
    select: { id: true },
  });
  const demoIds = demoUsers.map((user) => user.id);
  if (demoIds.length) {
    await prisma.printJob.deleteMany({ where: { order: { userId: { in: demoIds } } } });
    await prisma.order.deleteMany({ where: { userId: { in: demoIds } } });
    await prisma.cartLine.deleteMany({ where: { userId: { in: demoIds } } });
    await prisma.notification.deleteMany({ where: { userId: { in: demoIds } } });
    await prisma.user.deleteMany({ where: { id: { in: demoIds } } });
  }

  const phone = process.env.KITCHEN_ADMIN_PHONE?.replace(/\D/g, "");
  const email = process.env.KITCHEN_ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.KITCHEN_ADMIN_PASSWORD;
  const name = process.env.KITCHEN_ADMIN_NAME || "Wokora Kitchen";

  if (phone && email && password) {
    const passwordHash = await bcrypt.hash(password, 10);
    const existing = await prisma.user.findFirst({
      where: { storeId: "wokora", OR: [{ phone }, { email }] },
    });

    if (existing) {
      await prisma.user.update({
        where: { id: existing.id },
        data: {
          name,
          phone,
          email,
          passwordHash,
          role: "admin",
          emailVerified: true,
        },
      });
    } else {
      await prisma.user.create({
        data: {
          name,
          phone,
          email,
          passwordHash,
          role: "admin",
          emailVerified: true,
          storeId: "wokora",
        },
      });
    }
    console.log("Kitchen admin is ready. Login opens the kitchen; customers cannot open /admin.");
  } else {
    console.log("Store is ready. Set KITCHEN_ADMIN_PHONE, KITCHEN_ADMIN_EMAIL, and KITCHEN_ADMIN_PASSWORD to create the kitchen login.");
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
