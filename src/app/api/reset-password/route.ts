import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { consumeResetToken } from "@/lib/resetTokens";
import { verifyOtp } from "@/lib/otp";

export async function POST(request: Request) {
  const { token, email, otp, password } = await request.json();
  if (!password || String(password).length < 6) {
    return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
  }

  let userId: string | undefined;

  if (token) {
    userId = consumeResetToken(token) || undefined;
  } else if (email && otp) {
    const normalized = String(email).trim().toLowerCase();
    const ok = await verifyOtp(normalized, String(otp), "reset");
    if (!ok) {
      return NextResponse.json({ error: "Invalid or expired OTP" }, { status: 400 });
    }
    const user = await prisma.user.findUnique({ where: { email: normalized } });
    userId = user?.id;
    if (user && !user.emailVerified) {
      await prisma.user.update({
        where: { id: user.id },
        data: { emailVerified: true },
      });
    }
  }

  if (!userId) {
    return NextResponse.json({ error: "Reset request expired" }, { status: 400 });
  }

  await prisma.user.update({
    where: { id: userId },
    data: { passwordHash: await bcrypt.hash(password, 10) },
  });

  return NextResponse.json({ ok: true });
}
