import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const row = await prisma.cafeSettings.upsert({
      where: { id: "cafe" },
      update: {},
      create: { id: "cafe" },
    });
    return NextResponse.json({ settings: row });
  } catch (error) {
    console.error("[cafe-settings GET]", error);
    return NextResponse.json({
      settings: {
        name: "Wokora Foods",
        phone: "+91 98765 43210",
        email: "hello@wokorafoods.com",
        address: "12, Food Street, Koramangala",
        hours: "11:00 AM – 11:00 PM",
      },
    });
  }
}

export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions);
  if (session?.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const settings = await prisma.cafeSettings.upsert({
    where: { id: "cafe" },
    update: {
      ...(body.name ? { name: body.name } : {}),
      ...(body.phone ? { phone: body.phone } : {}),
      ...(body.email ? { email: body.email } : {}),
      ...(body.address ? { address: body.address } : {}),
      ...(body.hours ? { hours: body.hours } : {}),
    },
    create: {
      id: "cafe",
      name: body.name || "Wokora Foods",
      phone: body.phone || "+91 98765 43210",
      email: body.email || "hello@wokorafoods.com",
      address: body.address || "",
      hours: body.hours || "",
    },
  });

  return NextResponse.json({ settings });
}
