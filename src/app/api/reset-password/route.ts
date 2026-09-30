import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { consumeResetToken } from "@/lib/resetTokens";
import { passwordSchema } from "@/lib/validations";
import { SERVER_ERROR } from "@/lib/publicError";

export async function POST(request: Request) {
  const { token, password } = await request.json();
  const parsed = passwordSchema.safeParse(password);
  if (!parsed.success) {
    return NextResponse.json({ error: SERVER_ERROR }, { status: 400 });
  }

  const userId = typeof token === "string" ? consumeResetToken(token) : null;
  if (!userId) {
    return NextResponse.json({ error: "Reset request expired" }, { status: 400 });
  }

  await prisma.user.update({
    where: { id: userId },
    data: { passwordHash: await bcrypt.hash(parsed.data, 10) },
  });

  return NextResponse.json({ ok: true });
}
