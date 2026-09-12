import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);
  const featured = await prisma.menuItem.findMany({
    where: { isAvailable: true, isFeatured: true },
    include: { category: true },
    take: 8,
  });

  if (!session?.user.id) {
    return NextResponse.json({ items: featured, reason: "popular" });
  }

  const history = await prisma.orderItem.findMany({
    where: { order: { userId: session.user.id } },
    include: { menuItem: { include: { category: true } } },
  });

  if (history.length === 0) {
    return NextResponse.json({ items: featured, reason: "popular" });
  }

  const orderedIds = Array.from(new Set(history.map((row) => row.menuItemId)));
  const categoryIds = Array.from(new Set(history.map((row) => row.menuItem.categoryId)));

  const similar = await prisma.menuItem.findMany({
    where: {
      isAvailable: true,
      categoryId: { in: categoryIds },
      id: { notIn: orderedIds },
    },
    include: { category: true },
    take: 8,
  });

  const items = similar.length >= 3 ? similar : [...similar, ...featured].slice(0, 8);
  return NextResponse.json({ items, reason: "history" });
}
