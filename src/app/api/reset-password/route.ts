import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { consumeResetToken } from "@/lib/resetTokens";

export async function POST(request: Request) {
  const { token, password } = await request.json();
  if (!token || !password || password.length < 6) {
    return NextResponse.json({ error: "Invalid reset request" }, { status: 400 });
  }

  const userId = consumeResetToken(token);
  if (!userId) {
    return NextResponse.json({ error: "Reset link expired" }, { status: 400 });
  }

  await prisma.user.update({
    where: { id: userId },
    data: { passwordHash: await bcrypt.hash(password, 10) },
  });

  return NextResponse.json({ ok: true });
}
