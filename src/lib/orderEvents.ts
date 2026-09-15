import { prisma } from "./prisma";
import { notifyOrderPlaced } from "./notify";
import { BRAND, displayOrderNumber } from "./constants";

export type OrderPlacedEvent = {
  type: "OrderPlaced";
  storeId: string;
  orderId: string;
  userId: string;
  serialNumber: number;
  tableNumber: string | null;
  orderType: string;
  status: string;
  paymentStatus: string;
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  createdAt: string;
  customer: { name: string; phone: string; email?: string | null };
  items: { name: string; quantity: number; price: number; isVeg: boolean; customization?: string }[];
};

export type OrderUpdatedEvent = {
  type: "OrderUpdated";
  storeId: string;
  orderId: string;
  userId: string;
  serialNumber: number;
  status: string;
  etaMinutes?: number | null;
};

async function printTicket(event: OrderPlacedEvent) {
  await prisma.printJob.create({
    data: {
      storeId: event.storeId,
      orderId: event.orderId,
      status: "pending",
      payload: JSON.stringify({
        id: event.orderId,
        tableNumber: event.tableNumber,
        type: event.orderType,
        items: event.items,
        subtotal: event.subtotal,
        taxAmount: event.taxAmount,
        totalAmount: event.totalAmount,
        createdAt: event.createdAt,
        customerName: event.customer.name,
        customerPhone: event.customer.phone,
      }),
    },
  });
}

async function notify(event: OrderPlacedEvent | OrderUpdatedEvent) {
  if (event.type === "OrderPlaced") {
    await notifyOrderPlaced({
      id: event.orderId,
      serialNumber: event.serialNumber,
      userId: event.userId,
      storeId: event.storeId,
      tableNumber: event.tableNumber,
      totalAmount: event.totalAmount,
      user: event.customer,
    });
    return;
  }

  await prisma.notification.create({
    data: {
      storeId: event.storeId,
      userId: event.userId,
      title: `${BRAND.name}: Order ${displayOrderNumber(event.serialNumber)} ${event.status}`,
      body: event.etaMinutes
        ? `Kitchen ETA is ${event.etaMinutes} minutes.`
        : `Your order is now ${event.status}.`,
      orderId: event.orderId,
    },
  });
}

export async function afterOrderPlaced(event: OrderPlacedEvent) {
  await Promise.allSettled([printTicket(event), notify(event)]);
}

export async function afterOrderUpdated(event: OrderUpdatedEvent) {
  await notify(event);
}
