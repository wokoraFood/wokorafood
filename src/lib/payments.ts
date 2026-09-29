import { prisma } from "@/lib/prisma";

export type PaymentStatus = "pending" | "paid" | "failed" | "pay_at_counter";

type RecordPaymentInput = {
  storeId: string;
  orderId: string;
  userId: string;
  method: string;
  status: PaymentStatus;
  amount: number;
  upiVpa?: string;
  upiApp?: string;
  txnRef?: string;
  failureReason?: string;
};

export async function recordPayment(input: RecordPaymentInput) {
  return prisma.payment.create({
    data: {
      storeId: input.storeId,
      orderId: input.orderId,
      userId: input.userId,
      method: input.method,
      status: input.status,
      amount: input.amount,
      upiVpa: "",
      upiApp: input.upiApp || "",
      txnRef: input.txnRef || input.orderId,
      failureReason: input.failureReason || "",
      paidAt: input.status === "paid" ? new Date() : null,
    },
  });
}

export async function ensureOrderPayment(order: {
  id: string;
  storeId: string;
  userId: string;
  paymentMethod: string | null;
  paymentStatus: string;
  totalAmount: number;
  updatedAt: Date;
}) {
  const existing = await prisma.payment.findFirst({
    where: { orderId: order.id },
    orderBy: { createdAt: "desc" },
  });
  if (existing) return existing;
  return recordPayment({
    storeId: order.storeId,
    orderId: order.id,
    userId: order.userId,
    method: order.paymentMethod || "upi",
    status: (order.paymentStatus as PaymentStatus) || "pending",
    amount: order.totalAmount,
  });
}

export function hidePayoutFields<T extends { payments?: { upiVpa?: string }[] }>(record: T): T {
  if (!record.payments) return record;
  return {
    ...record,
    payments: record.payments.map((row) => ({ ...row, upiVpa: "" })),
  };
}
