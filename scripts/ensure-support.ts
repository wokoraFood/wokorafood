import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "SupportTicket" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "userId" TEXT,
      "name" TEXT NOT NULL,
      "phone" TEXT NOT NULL,
      "email" TEXT,
      "subject" TEXT NOT NULL,
      "message" TEXT NOT NULL,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);
  console.log("SupportTicket table ready");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
