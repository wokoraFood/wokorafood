import { NextResponse } from "next/server";
import { verifyOtp, type OtpPurpose } from "@/lib/otp";

export async function POST(request: Request) {
  const { email, otp, purpose, consume } = await request.json();
  const allowed: OtpPurpose[] = ["signup", "login", "reset"];
  if (!email || !otp || !allowed.includes(purpose)) {
    return NextResponse.json({ error: "Invalid OTP request" }, { status: 400 });
  }

  const ok = await verifyOtp(email, otp, purpose, consume !== false);
  if (!ok) {
    return NextResponse.json({ error: "Invalid or expired OTP" }, { status: 400 });
  }
  return NextResponse.json({ ok: true });
}
