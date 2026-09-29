import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validations";
import { verifyOtp } from "@/lib/otp";
import { normalizePhone } from "@/lib/phone";
import { DEFAULT_STORE_ID, ensureDefaultStore } from "@/lib/store";
import { serverErrorJson } from "@/lib/publicError";

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

  const normalizedEmail = email.toLowerCase();
  const otpOk = await verifyOtp(normalizedEmail, otp, "signup");
  if (!otpOk) {
    return NextResponse.json({ error: "Invalid or expired email OTP" }, { status: 400 });
  }

  try {
  await ensureDefaultStore();
  const exists = await prisma.user.findFirst({
    where: { storeId: DEFAULT_STORE_ID, OR: [{ phone }, { email: normalizedEmail }] },
  });

  if (exists) {
    return NextResponse.json({ error: "Phone or email already registered" }, { status: 409 });
  }

  const user = await prisma.user.create({
    data: {
      name,
      phone,
      email: normalizedEmail,
      passwordHash: await bcrypt.hash(password, 10),
      emailVerified: true,
      storeId: DEFAULT_STORE_ID,
    },
    select: { id: true, name: true, phone: true, email: true },
  });

  return NextResponse.json({ user });
  } catch (error) {
    console.error("[register]", error);
    return serverErrorJson();
  }
}
