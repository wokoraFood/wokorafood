import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { BRAND } from "@/lib/constants";

function publicShop(row: {
  name: string;
  phone: string;
  email: string;
  address: string;
  hours: string;
}) {
  return {
    name: row.name,
    phone: row.phone,
    email: row.email,
    address: row.address,
    hours: row.hours,
  };
}

export async function GET() {
  try {
    let row = await prisma.cafeSettings.findUnique({ where: { id: "cafe" } });
    if (!row) {
      row = await prisma.cafeSettings.create({
        data: {
          id: "cafe",
          name: BRAND.name,
          phone: BRAND.phone,
          email: BRAND.email,
          address: BRAND.address,
          hours: "11:00 AM – 11:00 PM",
          upiVpa: "",
        },
      });
    }
    return NextResponse.json({ settings: publicShop(row) });
  } catch (error) {
    console.error("[cafe-settings GET]", error);
    return NextResponse.json({
      settings: publicShop({
        name: "Wokora Foods",
        phone: BRAND.phone,
        email: BRAND.email,
        address: BRAND.address,
        hours: "11:00 AM – 11:00 PM",
      }),
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
      upiVpa: "",
    },
  });

  return NextResponse.json({ settings: publicShop(settings) });
}
