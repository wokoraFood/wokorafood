import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { DEFAULT_STORE_ID } from "@/lib/store";
import { publicPayeeName, settlementVpa } from "@/lib/payoutAccount";
import { isValidUpiVpa } from "@/lib/upi";
import { buildOrderUpiQuery, publicUpiApps, upiQrDataUrl } from "@/lib/upiIntent";
import { assertSameOriginIfPresent, paymentToken, rateLimit } from "@/lib/security";

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user.id) {
      return NextResponse.json({ error: "Login required" }, { status: 401 });
    }

    const originBlock = assertSameOriginIfPresent(_request);
    if (originBlock) return originBlock;
    const limited = rateLimit(`upi:${session.user.id}:${params.id}`, 40, 5 * 60 * 1000);
    if (limited) return limited;

    const order = await prisma.order.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        userId: true,
        storeId: true,
        serialNumber: true,
        totalAmount: true,
        paymentStatus: true,
        status: true,
      },
    });
    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

    if (session.user.role !== "admin" && order.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    if (session.user.role === "admin" && order.storeId !== (session.user.storeId || DEFAULT_STORE_ID)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (order.status === "cancelled" || order.paymentStatus === "paid") {
      return NextResponse.json({ error: "Payment is closed" }, { status: 409 });
    }

    const vpa = settlementVpa();
    const query = buildOrderUpiQuery(order);
    const qrDataUrl = await upiQrDataUrl(query);

    return NextResponse.json(
      {
        valid: isValidUpiVpa(vpa) && Boolean(query),
        payeeName: publicPayeeName(),
        payToken: paymentToken(order.id, order.userId),
        qrDataUrl,
        apps: publicUpiApps(),
      },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    console.error("[upi GET]", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
