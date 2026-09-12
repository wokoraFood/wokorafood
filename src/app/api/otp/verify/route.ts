import { NextResponse } from "next/server";
import { verifyOtp } from "@/lib/otp";

export async function POST(request: Request) {
  const { phone, otp } = await request.json();
  const ok = verifyOtp(phone, otp);
  if (!ok) {
    return NextResponse.json({ error: "Invalid or expired OTP" }, { status: 400 });
  }
  return NextResponse.json({ ok: true });
}
