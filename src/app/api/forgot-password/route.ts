import { NextResponse } from "next/server";
import { mailConfigured, sendMail } from "@/lib/mail";
import { prisma } from "@/lib/prisma";
import { createResetToken } from "@/lib/resetTokens";
import { getSiteUrl, BRAND } from "@/lib/constants";
import { SERVER_ERROR, userFacingError } from "@/lib/publicError";

export async function POST(request: Request) {
  const { email } = await request.json();
  if (!email || !String(email).includes("@")) {
    return NextResponse.json({ error: "Enter the email on your account" }, { status: 400 });
  }

  if (!mailConfigured()) {
    return NextResponse.json({ error: SERVER_ERROR }, { status: 503 });
  }

  const normalized = String(email).trim().toLowerCase();
  const user = await prisma.user.findUnique({ where: { email: normalized } });
  if (!user) {
    return NextResponse.json({ ok: true });
  }

  try {
    const token = createResetToken(user.id);
    const link = `${getSiteUrl()}/reset-password?token=${token}`;
    await sendMail(
      normalized,
      `${BRAND.name} password reset`,
      `Reset your ${BRAND.name} password with this link. It expires in 30 minutes.\n\n${link}`
    );
    return NextResponse.json({ ok: true });
  } catch (error) {
    const raw = error instanceof Error ? error.message : SERVER_ERROR;
    return NextResponse.json({ error: userFacingError(raw) }, { status: 500 });
  }
}
