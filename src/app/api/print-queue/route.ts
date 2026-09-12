import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { buildReceiptHtml } from "@/lib/printReceipt";

function authorized(request: Request, role?: string) {
  const secret = request.headers.get("authorization")?.replace("Bearer ", "");
  if (secret && secret === process.env.PRINT_AGENT_SECRET) return true;
  return role === "admin";
}

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!authorized(request, session?.user.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const jobs = await prisma.printJob.findMany({
    where: { status: "pending" },
    orderBy: { createdAt: "asc" },
    take: 20,
  });

  return NextResponse.json({
    jobs: jobs.map((job) => ({
      ...job,
      html: buildReceiptHtml(JSON.parse(job.payload) as Parameters<typeof buildReceiptHtml>[0]),
    })),
  });
}

export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions);
  if (!authorized(request, session?.user.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id, status } = await request.json();
  const job = await prisma.printJob.update({
    where: { id },
    data: {
      status: status || "printed",
      printedAt: status === "failed" ? null : new Date(),
    },
  });

  if (job.status === "printed") {
    await prisma.order.update({
      where: { id: job.orderId },
      data: { printedAt: new Date() },
    });
  }

  return NextResponse.json({ job });
}
