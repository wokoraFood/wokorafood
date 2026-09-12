import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user.id) {
    return NextResponse.json({ error: "Login required" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      phone: true,
      email: true,
      loyaltyPoints: true,
      addresses: true,
      orders: {
        include: { items: { include: { menuItem: true } } },
        orderBy: { createdAt: "desc" },
        take: 20,
      },
    },
  });

  return NextResponse.json({ user });
}

export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user.id) {
    return NextResponse.json({ error: "Login required" }, { status: 401 });
  }

  const { name, email, password } = await request.json();
  const bcrypt = password ? await import("bcryptjs") : null;
  const user = await prisma.user.update({
    where: { id: session.user.id },
    data: {
      ...(name ? { name } : {}),
      ...(email !== undefined ? { email: email || null } : {}),
      ...(password && bcrypt ? { passwordHash: await bcrypt.hash(password, 10) } : {}),
    },
    select: { id: true, name: true, phone: true, email: true, loyaltyPoints: true },
  });

  return NextResponse.json({ user });
}
