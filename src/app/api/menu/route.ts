import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const q = searchParams.get("q")?.trim();
  const featured = searchParams.get("featured") === "true";

  const session = await getServerSession(authOptions);
  const showHidden = session?.user.role === "admin" && searchParams.get("all") === "true";

  const items = await prisma.menuItem.findMany({
    where: {
      ...(showHidden ? {} : { isAvailable: true }),
      ...(category && category !== "all" ? { category: { slug: category } } : {}),
      ...(featured ? { isFeatured: true } : {}),
      ...(q
        ? {
            OR: [
              { name: { contains: q } },
              { description: { contains: q } },
            ],
          }
        : {}),
    },
    include: { category: true },
    orderBy: [{ category: { sortOrder: "asc" } }, { name: "asc" }],
  });

  const used = new Set(items.map((item) => item.categoryId));
  const categories = (await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
  })).filter((row) => showHidden || used.has(row.id));

  return NextResponse.json({ items, categories });
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (session?.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const item = await prisma.menuItem.create({
    data: {
      name: body.name,
      slug: body.slug || body.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      categoryId: body.categoryId,
      description: body.description || "",
      price: Number(body.price),
      imageUrl: body.imageUrl || "/images/menu/placeholder.jpg",
      isVeg: Boolean(body.isVeg),
      isAvailable: body.isAvailable !== false,
      isFeatured: Boolean(body.isFeatured),
    },
    include: { category: true },
  });

  return NextResponse.json({ item });
}
