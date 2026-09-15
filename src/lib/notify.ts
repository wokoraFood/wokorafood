import { prisma } from "./prisma";
import { BRAND, displayOrderNumber } from "./constants";
import { DEFAULT_STORE_ID } from "./store";

type NotifyInput = {
  userId: string;
  storeId?: string;
  title: string;
  body: string;
  orderId?: string;
  email?: string | null;
};

export async function notifyUser(input: NotifyInput) {
  const notification = await prisma.notification.create({
    data: {
      userId: input.userId,
      storeId: input.storeId || DEFAULT_STORE_ID,
      title: input.title,
      body: input.body,
      orderId: input.orderId,
    },
  });

  if (input.email) {
    await sendEmail(input.email, input.title, input.body);
  }

  return notification;
}

export async function notifyOrderPlaced(order: {
  id: string;
  serialNumber: number;
  userId: string;
  storeId?: string;
  tableNumber: string | null;
  totalAmount: number;
  user: { email?: string | null; phone: string };
}) {
  const number = displayOrderNumber(order.serialNumber);
  const title = `${BRAND.name}: Order ${number} received`;
  const body = `Your order ${number} has reached the kitchen${
    order.tableNumber ? ` (Table ${order.tableNumber})` : ""
  }. Total ₹${Math.round(order.totalAmount)}. We will notify you as soon as the kitchen sets a wait time.`;
  return notifyUser({
    userId: order.userId,
    storeId: order.storeId,
    title,
    body,
    orderId: order.id,
    email: order.user.email,
  });
}

export async function notifyOrderEta(order: {
  id: string;
  serialNumber: number;
  userId: string;
  etaMinutes: number;
  user: { email?: string | null };
}) {
  const number = displayOrderNumber(order.serialNumber);
  const title = `${BRAND.name}: Order ${number} — ${order.etaMinutes} min`;
  const body = `Your order number is ${number}. The kitchen expects it to be ready in ${order.etaMinutes} minutes.`;
  return notifyUser({
    userId: order.userId,
    title,
    body,
    orderId: order.id,
    email: order.user.email,
  });
}

/**
 * Email sender. Set SMTP_HOST / SMTP_USER / SMTP_PASS / SMTP_FROM to enable.
 * Without SMTP, the same message is still stored as an in-app notification.
 */
async function sendEmail(to: string, subject: string, text: string) {
  console.info(`[email] ${to}\n${subject}\n${text}`);
  // Wire SMTP later with nodemailer when SMTP_HOST / SMTP_USER / SMTP_PASS are set.
}
