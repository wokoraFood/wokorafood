import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validations";
import { verifyOtp } from "@/lib/otp";
import { normalizePhone } from "@/lib/phone";

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = registerSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
  }

  const { name, email, password, otp } = parsed.data;
  const phone = normalizePhone(parsed.data.phone);
  if (!/^[6-9]\d{9}$/.test(phone)) {
    return NextResponse.json({ error: "Enter a valid 10-digit Indian mobile number" }, { status: 400 });
  }

  if (otp && !verifyOtp(phone, otp)) {
    return NextResponse.json({ error: "Invalid or expired OTP" }, { status: 400 });
  }

  const exists = await prisma.user.findFirst({
    where: { OR: [{ phone }, ...(email ? [{ email: email.toLowerCase() }] : [])] },
  });

  if (exists) {
    return NextResponse.json({ error: "Phone or email already registered" }, { status: 409 });
  }

  const user = await prisma.user.create({
    data: {
      name,
      phone,
      email: email ? email.toLowerCase() : null,
      passwordHash: await bcrypt.hash(password, 10),
      phoneVerified: Boolean(otp),
    },
    select: { id: true, name: true, phone: true, email: true },
  });

  return NextResponse.json({ user });
}
