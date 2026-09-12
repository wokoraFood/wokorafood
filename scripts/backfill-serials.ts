import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const orders = await prisma.order.findMany({ orderBy: { createdAt: "asc" } });
  let serial = 0;
  for (const order of orders) {
    serial += 1;
    if (order.serialNumber !== serial) {
      await prisma.order.update({
        where: { id: order.id },
        data: { serialNumber: serial },
      });
    }
  }
  console.log(`Backfilled ${orders.length} order serials`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
