import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.store.upsert({
    where: { id: "wokora" },
    update: { name: "Wokora Foods" },
    create: { id: "wokora", slug: "wokora", name: "Wokora Foods" },
  });
  const users = await prisma.user.count();
  const items = await prisma.menuItem.count();
  console.log(`store ok · users ${users} · menu ${items}`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
