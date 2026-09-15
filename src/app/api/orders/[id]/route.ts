import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { printReceipt } from "@/lib/printReceipt";
import { afterOrderUpdated, type OrderUpdatedEvent } from "@/lib/orderEvents";
import { DEFAULT_STORE_ID } from "@/lib/store";
import { attachItemCustomizations } from "@/lib/cartPersistence";

const STATUSES = new Set(["placed", "preparing", "ready", "served", "cancelled"]);

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user.id) {
    return NextResponse.json({ error: "Login required" }, { status: 401 });
  }

  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: {
      items: { include: { menuItem: true } },
      user: { select: { name: true, phone: true, email: true } },
    },
  });

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  if (session.user.role !== "admin" && order.userId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  if (session.user.role === "admin" && order.storeId !== (session.user.storeId || DEFAULT_STORE_ID)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.json({ order: (await attachItemCustomizations([order]))[0] });
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user.id) {
    return NextResponse.json({ error: "Login required" }, { status: 401 });
  }

  const body = await request.json();
  const existing = await prisma.order.findUnique({
    where: { id: params.id },
    include: { user: { select: { name: true, phone: true, email: true } } },
  });
  if (!existing) return NextResponse.json({ error: "Order not found" }, { status: 404 });

  if (body.pay) {
    if (session.user.role !== "admin" && existing.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const order = await prisma.order.update({
      where: { id: params.id },
      data: {
        paymentStatus: "paid",
        paymentMethod: body.paymentMethod || existing.paymentMethod || "upi",
      },
      include: {
        items: { include: { menuItem: true } },
        user: { select: { name: true, phone: true, email: true } },
      },
    });
    return NextResponse.json({ order });
  }

  if (session.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (body.reprint) {
    const printItems = (
      await prisma.orderItem.findMany({
        where: { orderId: existing.id },
        include: { menuItem: true },
      })
    );
    const withNotes = (await attachItemCustomizations([{ items: printItems }]))[0];
    await printReceipt({
      id: existing.id,
      tableNumber: existing.tableNumber,
      type: existing.type as "dine_in" | "takeaway",
      items: withNotes.items.map((item) => ({
        name: item.menuItem.name,
        customization: item.customization || "",
        quantity: item.quantity,
        price: item.priceAtOrder,
      })),
      subtotal: existing.subtotal,
      taxAmount: existing.taxAmount,
      totalAmount: existing.totalAmount,
      createdAt: existing.createdAt,
      customerName: existing.user.name,
      customerPhone: existing.user.phone,
    });
    return NextResponse.json({ ok: true });
  }

  const data: {
    status?: string;
    etaMinutes?: number;
    etaSetAt?: Date;
    paymentStatus?: string;
  } = {};

  if (body.status && STATUSES.has(body.status)) {
    data.status = body.status;
  }

  if (body.etaMinutes !== undefined) {
    const etaMinutes = Number(body.etaMinutes);
    if (!Number.isFinite(etaMinutes) || etaMinutes < 1 || etaMinutes > 180) {
      return NextResponse.json({ error: "Enter wait time between 1 and 180 minutes" }, { status: 400 });
    }
    data.etaMinutes = etaMinutes;
    data.etaSetAt = new Date();
    if (!body.status) data.status = "preparing";
  }

  if (body.paymentStatus) {
    data.paymentStatus = body.paymentStatus;
  }

  const order = await prisma.order.update({
    where: { id: params.id },
    data,
    include: {
      items: { include: { menuItem: true } },
      user: { select: { name: true, phone: true, email: true } },
    },
  });

  const updated: OrderUpdatedEvent = {
    type: "OrderUpdated",
    storeId: order.storeId,
    orderId: order.id,
    userId: order.userId,
    serialNumber: order.serialNumber,
    status: order.status,
    etaMinutes: order.etaMinutes,
  };

  await afterOrderUpdated(updated);

  return NextResponse.json({ order });
}
