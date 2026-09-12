import { PrismaClient } from "@prisma/client";
import { MENU_CATEGORIES, MENU_ITEMS } from "../src/data/menu";

const prisma = new PrismaClient();

async function main() {
  const pizza = await prisma.category.findUnique({
    where: { slug: "pizza" },
    include: { items: true },
  });

  if (pizza) {
    await prisma.menuItem.updateMany({
      where: { categoryId: pizza.id },
      data: { isAvailable: false, isFeatured: false },
    });
  }

  const chinese = await prisma.category.findUnique({ where: { slug: "chinese" } });
  if (chinese) {
    await prisma.menuItem.updateMany({
      where: { categoryId: chinese.id },
      data: { isAvailable: false },
    });
  }

  for (const category of MENU_CATEGORIES) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {
        name: category.name,
        sortOrder: category.sortOrder,
        iconUrl: category.image,
      },
      create: {
        name: category.name,
        slug: category.slug,
        sortOrder: category.sortOrder,
        iconUrl: category.image,
      },
    });
  }

  const categories = await prisma.category.findMany();
  const bySlug = Object.fromEntries(categories.map((row) => [row.slug, row.id]));

  for (const item of MENU_ITEMS) {
    const categoryId = bySlug[item.category];
    if (!categoryId) continue;
    await prisma.menuItem.upsert({
      where: { slug: item.slug },
      update: {
        name: item.name,
        categoryId,
        description: item.description,
        price: item.price,
        imageUrl: item.imageUrl,
        isVeg: item.isVeg,
        isAvailable: true,
        isFeatured: "isFeatured" in item ? Boolean(item.isFeatured) : false,
      },
      create: {
        name: item.name,
        slug: item.slug,
        categoryId,
        description: item.description,
        price: item.price,
        imageUrl: item.imageUrl,
        isVeg: item.isVeg,
        isFeatured: "isFeatured" in item ? Boolean(item.isFeatured) : false,
      },
    });
  }

  console.log("Menu updated: pizza hidden, Asian plates added, images refreshed.");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
