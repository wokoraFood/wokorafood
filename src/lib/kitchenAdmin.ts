import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { DEFAULT_STORE_ID, ensureDefaultStore } from "@/lib/store";

export function kitchenAdminFromEnv() {
  return {
    name: process.env.KITCHEN_ADMIN_NAME?.trim() || "Wokora Kitchen",
    phone: (process.env.KITCHEN_ADMIN_PHONE || "").replace(/\D/g, ""),
    email: (process.env.KITCHEN_ADMIN_EMAIL || "").trim().toLowerCase(),
    password: process.env.KITCHEN_ADMIN_PASSWORD || "",
  };
}

export function isKitchenIdentifier(identifier: string) {
  const kitchen = kitchenAdminFromEnv();
  if (!identifier) return false;
  return identifier === kitchen.email || identifier === kitchen.phone;
}

export async function loginKitchenAdmin(identifier: string, password: string) {
  const kitchen = kitchenAdminFromEnv();
  if (!kitchen.email || !kitchen.phone || !kitchen.password) return null;
  if (!isKitchenIdentifier(identifier)) return null;
  if (password !== kitchen.password) return null;

  await ensureDefaultStore();
  const passwordHash = await bcrypt.hash(kitchen.password, 10);
  const existing = await prisma.user.findFirst({
    where: {
      storeId: DEFAULT_STORE_ID,
      OR: [{ email: kitchen.email }, { phone: kitchen.phone }],
    },
  });

  if (existing) {
    return prisma.user.update({
      where: { id: existing.id },
      data: {
        name: kitchen.name,
        email: kitchen.email,
        phone: kitchen.phone,
        passwordHash,
        role: "admin",
        emailVerified: true,
      },
    });
  }

  return prisma.user.create({
    data: {
      name: kitchen.name,
      email: kitchen.email,
      phone: kitchen.phone,
      passwordHash,
      role: "admin",
      emailVerified: true,
      storeId: DEFAULT_STORE_ID,
    },
  });
}
