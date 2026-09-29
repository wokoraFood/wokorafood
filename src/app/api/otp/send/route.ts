import { NextResponse } from "next/server";
import { otpSendSchema } from "@/lib/validations";
import { createAndSendEmailOtp } from "@/lib/otp";
import { mailConfigured } from "@/lib/mail";
import { SERVER_ERROR, userFacingError } from "@/lib/publicError";

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = otpSendSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Enter a valid email" }, { status: 400 });
  }

  if (!mailConfigured()) {
    return NextResponse.json({ error: SERVER_ERROR }, { status: 503 });
  }

  try {
    await createAndSendEmailOtp(parsed.data.email, parsed.data.purpose);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const raw = error instanceof Error ? error.message : SERVER_ERROR;
    const status = raw.startsWith("Wait ") ? 429 : 500;
    return NextResponse.json({ error: userFacingError(raw) }, { status });
  }
}
