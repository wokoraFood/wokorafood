import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { BRAND } from "@/lib/constants";

export async function GET() {
  try {
    const row = await prisma.cafeSettings.upsert({
      where: { id: "cafe" },
      update: { address: BRAND.address, email: BRAND.email, phone: BRAND.phone },
      create: {
        id: "cafe",
        name: BRAND.name,
        phone: BRAND.phone,
        email: BRAND.email,
        address: BRAND.address,
        hours: "11:00 AM – 11:00 PM",
      },
    });
    return NextResponse.json({ settings: row });
  } catch (error) {
    console.error("[cafe-settings GET]", error);
    return NextResponse.json({
      settings: {
        name: "Wokora Foods",
        phone: BRAND.phone,
        email: BRAND.email,
        address: BRAND.address,
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
      phone: body.phone || BRAND.phone,
      email: body.email || BRAND.email,
      address: body.address || BRAND.address,
      hours: body.hours || "",
    },
  });

  return NextResponse.json({ settings });
}
