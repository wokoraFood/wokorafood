import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { orderSchema } from "@/lib/validations";
import { GST_RATE, loyaltyFromTotal } from "@/lib/constants";
import { printReceipt } from "@/lib/printReceipt";
import { notifyOrderPlaced } from "@/lib/notify";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user.id) {
    return NextResponse.json({ error: "Login required" }, { status: 401 });
  }

  const isAdmin = session.user.role === "admin";
  const orders = await prisma.order.findMany({
    where: isAdmin ? {} : { userId: session.user.id },
    include: {
      items: { include: { menuItem: true } },
      user: { select: { name: true, phone: true, email: true } },
    },
    orderBy: isAdmin ? { serialNumber: "asc" } : { createdAt: "desc" },
  });

  return NextResponse.json({ orders });
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user.id) {
    return NextResponse.json({ error: "Login required to place an order" }, { status: 401 });
  }

  const parsed = orderSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
  }

  const { items, type, tableNumber, notes, paymentMethod } = parsed.data;

  if (type === "dine_in" && !tableNumber) {
    return NextResponse.json({ error: "Table number is required for dine-in" }, { status: 400 });
  }

  const menuItems = await prisma.menuItem.findMany({
    where: { id: { in: items.map((item) => item.menuItemId) }, isAvailable: true },
  });

  if (menuItems.length !== items.length) {
    return NextResponse.json({ error: "One or more items are unavailable" }, { status: 400 });
  }

  const priced = items.map((item) => {
    const menuItem = menuItems.find((row) => row.id === item.menuItemId)!;
    return {
      menuItem,
      quantity: item.quantity,
      lineTotal: menuItem.price * item.quantity,
    };
  });

  const subtotal = priced.reduce((sum, row) => sum + row.lineTotal, 0);
  const taxAmount = Math.round(subtotal * GST_RATE);
  const totalAmount = subtotal + taxAmount;

  const last = await prisma.order.findFirst({
    orderBy: { serialNumber: "desc" },
    select: { serialNumber: true },
  });
  const serialNumber = (last?.serialNumber || 0) + 1;

  const order = await prisma.order.create({
    data: {
      serialNumber,
      userId: session.user.id,
      tableNumber: type === "dine_in" ? tableNumber : null,
      type,
      status: "placed",
      paymentMethod: paymentMethod || null,
      paymentStatus: paymentMethod === "cash" ? "pay_at_counter" : "pending",
      subtotal,
      taxAmount,
      totalAmount,
      notes,
      items: {
        create: priced.map((row) => ({
          menuItemId: row.menuItem.id,
          quantity: row.quantity,
          priceAtOrder: row.menuItem.price,
        })),
      },
    },
    include: {
      items: { include: { menuItem: true } },
      user: { select: { name: true, phone: true, email: true } },
    },
  });

  await prisma.user.update({
    where: { id: session.user.id },
    data: { loyaltyPoints: { increment: loyaltyFromTotal(totalAmount) } },
  });

  await printReceipt({
    id: order.id,
    tableNumber: order.tableNumber,
    type: order.type as "dine_in" | "takeaway",
    items: order.items.map((item) => ({
      name: item.menuItem.name,
      quantity: item.quantity,
      price: item.priceAtOrder,
    })),
    subtotal: order.subtotal,
    taxAmount: order.taxAmount,
    totalAmount: order.totalAmount,
    createdAt: order.createdAt,
    customerName: order.user.name,
    customerPhone: order.user.phone,
  });

  await notifyOrderPlaced(order);

  return NextResponse.json({ order });
}
