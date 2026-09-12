import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createResetToken } from "@/lib/resetTokens";

export async function POST(request: Request) {
  const { identifier } = await request.json();
  if (!identifier) {
    return NextResponse.json({ error: "Phone or email is required" }, { status: 400 });
  }

  const user = await prisma.user.findFirst({
    where: { OR: [{ phone: identifier }, { email: identifier }] },
  });

  if (!user) {
    return NextResponse.json({ ok: true });
  }

  const token = createResetToken(user.id);
  const resetUrl = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/reset-password?token=${token}`;

  console.info(`[reset] ${user.phone}: ${resetUrl}`);

  return NextResponse.json({
    ok: true,
    demoResetUrl: process.env.NODE_ENV === "production" ? undefined : resetUrl,
  });
}
