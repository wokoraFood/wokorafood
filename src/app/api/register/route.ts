import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validations";
import { verifyOtp } from "@/lib/otp";
import { normalizePhone } from "@/lib/phone";
import { DEFAULT_STORE_ID, ensureDefaultStore } from "@/lib/store";
import { SERVER_ERROR, serverErrorJson } from "@/lib/publicError";

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = registerSchema.safeParse({
    ...body,
    phone: typeof body.phone === "string" ? normalizePhone(body.phone) : body.phone,
    name: typeof body.name === "string" ? body.name.trim().replace(/\s+/g, " ") : body.name,
    email: typeof body.email === "string" ? body.email.trim().toLowerCase() : body.email,
  });

  if (!parsed.success) {
    return NextResponse.json({ error: SERVER_ERROR }, { status: 400 });
  }

  const { name, phone, email, password, otp } = parsed.data;

  const otpOk = await verifyOtp(email, otp, "signup");
  if (!otpOk) {
    return NextResponse.json({ error: "Invalid or expired email OTP" }, { status: 400 });
  }

  try {
  await ensureDefaultStore();
  const exists = await prisma.user.findFirst({
    where: { storeId: DEFAULT_STORE_ID, OR: [{ phone }, { email }] },
  });

  if (exists) {
    return NextResponse.json({ error: "Phone or email already registered" }, { status: 409 });
  }

  const user = await prisma.user.create({
    data: {
      name,
      phone,
      email,
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
