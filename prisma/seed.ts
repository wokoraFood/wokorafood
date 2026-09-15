import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function ensureDemoUser(data: {
  name: string;
  phone: string;
  email: string;
  password: string;
  role: "admin" | "customer";
  loyaltyPoints?: number;
}) {
  const existing = await prisma.user.findUnique({
    where: { storeId_phone: { storeId: "wokora", phone: data.phone } },
  });
  if (existing) return existing;

  const passwordHash = await bcrypt.hash(data.password, 10);
  return prisma.user.create({
    data: {
      name: data.name,
      phone: data.phone,
      email: data.email,
      passwordHash,
      role: data.role,
      phoneVerified: true,
      storeId: "wokora",
      loyaltyPoints: data.loyaltyPoints || 0,
    },
  });
}

async function main() {
  await prisma.store.upsert({
    where: { id: "wokora" },
    update: { name: "Wokora Foods" },
    create: { id: "wokora", slug: "wokora", name: "Wokora Foods" },
  });

  await ensureDemoUser({
    name: "Wokora Admin",
    phone: "9999999999",
    email: "ivan.p@example.net",
    password: "Admin@1234",
    role: "admin",
  });
  await ensureDemoUser({
    name: "Aarav Mehta",
    phone: "9876543210",
    email: "aarav@example.com",
    password: "Taste@1234",
    role: "customer",
    loyaltyPoints: 40,
  });

  console.log("Demo kitchen and customer logins are ready. Existing users were left untouched.");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
