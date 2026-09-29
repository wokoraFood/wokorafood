import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { cacheDel, menuCacheKey } from "@/lib/cache/menu";
import { DEFAULT_STORE_ID } from "@/lib/store";
import { serverErrorJson } from "@/lib/publicError";

async function assertAdmin() {
  const session = await getServerSession(authOptions);
  if (session?.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  return session;
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const session = await assertAdmin();
  if (session instanceof NextResponse) return session;

  const body = await request.json();
  try {
  const category = await prisma.category.update({
    where: { id: params.id },
    data: {
      ...(body.name !== undefined ? { name: String(body.name).trim() } : {}),
      ...(body.iconUrl !== undefined ? { iconUrl: body.iconUrl || null } : {}),
    },
  });

  await cacheDel(menuCacheKey(session.user.storeId || DEFAULT_STORE_ID));
  return NextResponse.json({ category });
  } catch (error) {
    console.error("[categories PATCH]", error);
    return serverErrorJson();
  }
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const session = await assertAdmin();
  if (session instanceof NextResponse) return session;

  try {
    const items = await prisma.menuItem.findMany({
      where: { categoryId: params.id },
      select: { id: true },
    });
    const itemIds = items.map((item) => item.id);
    const ordered = itemIds.length
      ? await prisma.orderItem.count({ where: { menuItemId: { in: itemIds } } })
      : 0;
    if (ordered > 0) {
      return NextResponse.json(
        { error: "Cannot delete this plate: some dishes are on past orders. Hide those dishes instead." },
        { status: 400 }
      );
    }

    if (itemIds.length) {
      await prisma.cartLine.deleteMany({ where: { menuItemId: { in: itemIds } } });
      await prisma.menuItem.deleteMany({ where: { categoryId: params.id } });
    }

    await prisma.category.delete({ where: { id: params.id } });
    await cacheDel(menuCacheKey(session.user.storeId || DEFAULT_STORE_ID));
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[categories DELETE]", error);
    return serverErrorJson();
  }
}
