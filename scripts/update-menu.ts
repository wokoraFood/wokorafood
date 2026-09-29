import { PrismaClient } from "@prisma/client";
import { MENU_CATEGORIES, MENU_ITEMS } from "../src/data/menu";

const prisma = new PrismaClient();
const storeId = "wokora";

async function main() {
  await prisma.store.upsert({
    where: { id: storeId },
    update: { name: "Wokora Foods" },
    create: { id: storeId, slug: storeId, name: "Wokora Foods" },
  });

  for (const category of MENU_CATEGORIES) {
    await prisma.category.upsert({
      where: { storeId_slug: { storeId, slug: category.slug } },
      update: {
        name: category.name,
        sortOrder: category.sortOrder,
        iconUrl: category.image,
      },
      create: {
        storeId,
        name: category.name,
        slug: category.slug,
        sortOrder: category.sortOrder,
        iconUrl: category.image,
      },
    });
  }

  const categories = await prisma.category.findMany({ where: { storeId } });
  const bySlug = Object.fromEntries(categories.map((row) => [row.slug, row.id]));

  for (const item of MENU_ITEMS) {
    const categoryId = bySlug[item.category];
    if (!categoryId) continue;
    await prisma.menuItem.upsert({
      where: { storeId_slug: { storeId, slug: item.slug } },
      update: {
        name: item.name,
        categoryId,
        description: item.description,
        price: item.price,
        imageUrl: item.imageUrl,
        isVeg: item.isVeg,
        isAvailable: true,
        isFeatured: Boolean(item.isFeatured),
      },
      create: {
        storeId,
        name: item.name,
        slug: item.slug,
        categoryId,
        description: item.description,
        price: item.price,
        imageUrl: item.imageUrl,
        isVeg: item.isVeg,
        isFeatured: Boolean(item.isFeatured),
      },
    });
  }

  console.log("Menu catalog synced. Kitchen/admin extra items were left in place.");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
