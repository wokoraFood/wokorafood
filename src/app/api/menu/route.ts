import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { cacheDel, cacheGet, cacheSet, menuCacheKey } from "@/lib/cache/menu";
import { DEFAULT_STORE_ID } from "@/lib/store";
import { ALLOWED_CATEGORY_SLUGS } from "@/data/menu";
import { optionGroupsFor } from "@/lib/customizations";

const allowed = new Set(ALLOWED_CATEGORY_SLUGS);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const q = searchParams.get("q")?.trim();
  const featured = searchParams.get("featured") === "true";

  const session = await getServerSession(authOptions);
  const storeId = session?.user.storeId || DEFAULT_STORE_ID;
  const showHidden = session?.user.role === "admin" && searchParams.get("all") === "true";
  const cacheKey = menuCacheKey(storeId, `${showHidden ? "all" : "pub"}:${category || ""}:${q || ""}:${featured}`);

  if (!q) {
    const cached = await cacheGet<{ items: unknown; categories: unknown }>(cacheKey);
    if (cached) return NextResponse.json(cached);
  }

  const items = (await prisma.menuItem.findMany({
    where: {
      storeId,
      ...(showHidden ? {} : { isAvailable: true }),
      ...(category && category !== "all" ? { category: { slug: category } } : {}),
      ...(featured ? { isFeatured: true } : {}),
      ...(q
        ? {
            OR: [{ name: { contains: q } }, { description: { contains: q } }],
          }
        : {}),
    },
    include: { category: true },
    orderBy: [{ category: { sortOrder: "asc" } }, { name: "asc" }],
  })).filter((item) => showHidden || allowed.has(item.category.slug));

  const used = new Set(items.map((item) => item.categoryId));
  const categories = (await prisma.category.findMany({
    where: { storeId },
    orderBy: { sortOrder: "asc" },
  })).filter((row) => (showHidden || used.has(row.id)) && allowed.has(row.slug));

  const payload = {
    items: items.map((item) => ({
      ...item,
      optionGroups: optionGroupsFor(item.category.slug, item.isVeg),
    })),
    categories,
  };
  if (!q) await cacheSet(cacheKey, payload);
  return NextResponse.json(payload);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (session?.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const item = await prisma.menuItem.create({
    data: {
      storeId: session.user.storeId || DEFAULT_STORE_ID,
      name: body.name,
      slug: body.slug || body.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      categoryId: body.categoryId,
      description: body.description || "",
      price: Number(body.price),
      imageUrl: body.imageUrl || "/images/menu/placeholder.png",
      isVeg: Boolean(body.isVeg),
      isAvailable: body.isAvailable !== false,
      isFeatured: Boolean(body.isFeatured),
    },
    include: { category: true },
  });

  await cacheDel(menuCacheKey(session.user.storeId || DEFAULT_STORE_ID));
  return NextResponse.json({ item });
}
