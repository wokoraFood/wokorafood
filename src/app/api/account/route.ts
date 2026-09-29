import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { attachItemCustomizations } from "@/lib/cartPersistence";
import { ensureOrderPayment, hidePayoutFields } from "@/lib/payments";

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
      dietPreference: true,
      themePreference: true,
      addresses: true,
      orders: {
        include: {
          items: { include: { menuItem: true } },
          payments: { orderBy: { createdAt: "desc" } },
        },
        orderBy: { createdAt: "desc" },
        take: 50,
      },
    },
  });

  if (user?.orders.length) {
    await Promise.all(user.orders.map((order) => ensureOrderPayment(order)));
    user.orders = await prisma.order.findMany({
      where: { userId: user.id },
      include: {
        items: { include: { menuItem: true } },
        payments: { orderBy: { createdAt: "desc" } },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
  }

  const orders = user ? (await attachItemCustomizations(user.orders)).map(hidePayoutFields) : [];
  const lastDelivered = orders.find((order) => order.status === "served") || null;

  return NextResponse.json({
    user: user ? { ...user, orders, lastDelivered } : user,
  });
}

export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user.id) {
    return NextResponse.json({ error: "Login required" }, { status: 401 });
  }

  const { name, email, password, dietPreference, themePreference } = await request.json();
  const bcrypt = password ? await import("bcryptjs") : null;
  const diet =
    dietPreference === "veg" || dietPreference === "nonveg" || dietPreference === "all"
      ? dietPreference
      : undefined;
  const theme =
    themePreference === "light" || themePreference === "dark" || themePreference === "system"
      ? themePreference
      : undefined;
  const user = await prisma.user.update({
    where: { id: session.user.id },
    data: {
      ...(name ? { name } : {}),
      ...(email !== undefined ? { email: email || null } : {}),
      ...(password && bcrypt ? { passwordHash: await bcrypt.hash(password, 10) } : {}),
      ...(diet ? { dietPreference: diet } : {}),
      ...(theme ? { themePreference: theme } : {}),
    },
    select: {
      id: true,
      name: true,
      phone: true,
      email: true,
      loyaltyPoints: true,
      dietPreference: true,
      themePreference: true,
    },
  });

  return NextResponse.json({ user });
}
