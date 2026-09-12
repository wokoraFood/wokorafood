import { NextResponse } from "next/server";
import { createOtp, sendOtpSms } from "@/lib/otp";
import { normalizePhone } from "@/lib/phone";

export async function POST(request: Request) {
  const { phone: rawPhone } = await request.json();
  const phone = normalizePhone(rawPhone || "");
  if (!/^[6-9]\d{9}$/.test(phone)) {
    return NextResponse.json({ error: "Enter a valid 10-digit mobile number" }, { status: 400 });
  }

  const code = createOtp(phone);
  await sendOtpSms(phone, code);

  return NextResponse.json({
    ok: true,
    // Returned only in development so the flow is testable without Twilio.
    demoOtp: process.env.NODE_ENV === "production" ? undefined : code,
  });
}
