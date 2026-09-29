import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { cacheDel, menuCacheKey } from "@/lib/cache/menu";
import { DEFAULT_STORE_ID } from "@/lib/store";
import { serverErrorJson } from "@/lib/publicError";

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || `category-${Date.now().toString(36)}`;
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (session?.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const name = String(body.name || "").trim();
  if (name.length < 2) {
    return NextResponse.json({ error: "Category name is required" }, { status: 400 });
  }

  const storeId = session.user.storeId || DEFAULT_STORE_ID;
  try {
  const last = await prisma.category.findFirst({
    where: { storeId },
    orderBy: { sortOrder: "desc" },
  });
  const baseSlug = slugify(name);
  let slug = baseSlug;
  let n = 2;
  while (await prisma.category.findUnique({ where: { storeId_slug: { storeId, slug } } })) {
    slug = `${baseSlug}-${n}`;
    n += 1;
  }

  const category = await prisma.category.create({
    data: {
      storeId,
      name,
      slug,
      iconUrl: body.iconUrl || null,
      sortOrder: (last?.sortOrder || 0) + 1,
    },
  });

  await cacheDel(menuCacheKey(storeId));
  return NextResponse.json({ category });
  } catch (error) {
    console.error("[categories POST]", error);
    return serverErrorJson();
  }
}
