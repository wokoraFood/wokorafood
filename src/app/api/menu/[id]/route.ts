import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { cacheDel, menuCacheKey } from "@/lib/cache/menu";
import { DEFAULT_STORE_ID } from "@/lib/store";

async function assertAdmin() {
  const session = await getServerSession(authOptions);
  if (session?.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  return null;
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const denied = await assertAdmin();
  if (denied) return denied;

  const body = await request.json();
  const item = await prisma.menuItem.update({
    where: { id: params.id },
    data: {
      ...(body.name !== undefined ? { name: body.name } : {}),
      ...(body.description !== undefined ? { description: body.description } : {}),
      ...(body.price !== undefined ? { price: Number(body.price) } : {}),
      ...(body.imageUrl !== undefined ? { imageUrl: body.imageUrl } : {}),
      ...(body.isVeg !== undefined ? { isVeg: Boolean(body.isVeg) } : {}),
      ...(body.isAvailable !== undefined ? { isAvailable: Boolean(body.isAvailable) } : {}),
      ...(body.isFeatured !== undefined ? { isFeatured: Boolean(body.isFeatured) } : {}),
      ...(body.categoryId !== undefined ? { categoryId: body.categoryId } : {}),
    },
    include: { category: true },
  });

  await cacheDel(menuCacheKey(DEFAULT_STORE_ID));
  return NextResponse.json({ item });
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const denied = await assertAdmin();
  if (denied) return denied;

  await prisma.menuItem.delete({ where: { id: params.id } });
  await cacheDel(menuCacheKey(DEFAULT_STORE_ID));
  return NextResponse.json({ ok: true });
}
