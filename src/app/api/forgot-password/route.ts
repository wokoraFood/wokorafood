import { NextResponse } from "next/server";
import { createAndSendEmailOtp } from "@/lib/otp";
import { mailConfigured } from "@/lib/mail";
import { prisma } from "@/lib/prisma";
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
    await createAndSendEmailOtp(normalized, "reset");
    return NextResponse.json({ ok: true });
  } catch (error) {
    const raw = error instanceof Error ? error.message : SERVER_ERROR;
    const status = raw.startsWith("Wait ") ? 429 : 500;
    return NextResponse.json({ error: userFacingError(raw) }, { status });
  }
}
