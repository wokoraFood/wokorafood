import { PrismaClient } from "@prisma/client";
import { MENU_CATEGORIES, MENU_ITEMS } from "../src/data/menu";

const prisma = new PrismaClient();
const storeId = "wokora";
const keepItems = MENU_ITEMS.map((row) => row.slug);

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

  await prisma.menuItem.updateMany({
    where: { storeId, slug: { notIn: keepItems } },
    data: { isAvailable: false, isFeatured: false },
  });

  const keep = new Set<string>(MENU_CATEGORIES.map((row) => row.slug));
  const staleCategories = categories.filter((row) => !keep.has(row.slug));
  for (const category of staleCategories) {
    await prisma.menuItem.updateMany({
      where: { categoryId: category.id },
      data: { isAvailable: false, isFeatured: false },
    });
  }

  console.log("Menu locked to burger, coffee, momos, spring rolls, noodles, chilli potato, fried rice, wraps, lollipop.");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
