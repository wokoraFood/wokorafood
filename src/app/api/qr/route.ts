import { NextResponse } from "next/server";
import QRCode from "qrcode";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const table = searchParams.get("table") || "1";
  const base = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const url = `${base}/table/${table}`;
  const dataUrl = await QRCode.toDataURL(url, {
    margin: 1,
    color: { dark: "#0D0D0D", light: "#F5F5F0" },
  });
  return NextResponse.json({ url, dataUrl });
}
