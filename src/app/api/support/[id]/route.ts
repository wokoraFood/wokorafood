import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { notifyUser } from "@/lib/notify";

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user.id) {
    return NextResponse.json({ error: "Login required" }, { status: 401 });
  }

  const ticket = await prisma.supportTicket.findUnique({ where: { id: params.id } });
  if (!ticket) return NextResponse.json({ error: "Ticket not found" }, { status: 404 });

  const isAdmin = session.user.role === "admin";
  const isOwner = ticket.userId === session.user.id;
  if (!isAdmin && !isOwner) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();

  if (body.message) {
    await prisma.supportReply.create({
      data: {
        ticketId: ticket.id,
        authorName: session.user.name || (isAdmin ? "Kitchen" : "Customer"),
        authorRole: isAdmin ? "kitchen" : "customer",
        message: String(body.message),
      },
    });
  }

  const status = isAdmin && body.status ? String(body.status) : body.message && isAdmin ? "replied" : undefined;

  const updated = await prisma.supportTicket.update({
    where: { id: ticket.id },
    data: status ? { status } : {},
    include: { replies: { orderBy: { createdAt: "asc" } } },
  });

  if (isAdmin && ticket.userId && body.message) {
    await notifyUser({
      userId: ticket.userId,
      title: "Wokora Foods replied to your support case",
      body: String(body.message),
      email: ticket.email,
    });
  }

  return NextResponse.json({ ticket: updated });
}
