import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { DEFAULT_STORE_ID } from "@/lib/store";
import { loadCartExtras, replaceCartLines } from "@/lib/cartPersistence";

type IncomingLine = {
  id?: string;
  menuItemId?: string;
  quantity?: number;
  configKey?: string;
  customization?: string;
  selections?: Record<string, string[]>;
  price?: number;
};

function parseSelections(raw: string) {
  try {
    const parsed = JSON.parse(raw) as Record<string, string[]>;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user.id) {
    return NextResponse.json({ error: "Login required" }, { status: 401 });
  }
  if (session.user.role === "admin") {
    return NextResponse.json({ items: [] });
  }

  const storeId = session.user.storeId || DEFAULT_STORE_ID;
  const lines = await prisma.cartLine.findMany({
    where: { userId: session.user.id, storeId },
    include: { menuItem: true },
    orderBy: { createdAt: "asc" },
  });
  const extras = await loadCartExtras(session.user.id, storeId);

  return NextResponse.json({
    items: lines.map((line) => {
      const extra = extras.get(line.id);
      const configKey = extra?.configKey || "default";
      return {
        id: `${line.menuItem.id}::${configKey}`,
        menuItemId: line.menuItem.id,
        name: line.menuItem.name,
        price: extra?.unitPrice || line.menuItem.price,
        imageUrl: line.menuItem.imageUrl,
        isVeg: line.menuItem.isVeg,
        quantity: line.quantity,
        configKey,
        customization: extra?.customization || "",
        selections: parseSelections(extra?.selections || "{}"),
      };
    }),
  });
}

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user.id) {
    return NextResponse.json({ error: "Login required" }, { status: 401 });
  }
  if (session.user.role === "admin") {
    return NextResponse.json({ ok: true });
  }

  const body = await request.json();
  const incoming: IncomingLine[] = Array.isArray(body.items) ? body.items : [];
  const userId = session.user.id;
  const storeId = session.user.storeId || DEFAULT_STORE_ID;

  const merged = new Map<
    string,
    {
      menuItemId: string;
      configKey: string;
      quantity: number;
      customization: string;
      selections: string;
      unitPrice: number;
    }
  >();

  incoming.forEach((row) => {
    const menuItemId = String(row.menuItemId || String(row.id || "").split("::")[0] || "");
    const fromId = String(row.id || "").includes("::") ? String(row.id).split("::").slice(1).join("::") : "";
    const configKey = String(row.configKey || fromId || "default");
    const quantity = Math.min(20, Math.max(0, Number(row.quantity) || 0));
    if (!menuItemId || quantity <= 0) return;
    const key = `${menuItemId}::${configKey}`;
    const prev = merged.get(key);
    merged.set(key, {
      menuItemId,
      configKey,
      quantity: Math.min(20, (prev?.quantity || 0) + quantity),
      customization: String(row.customization || prev?.customization || ""),
      selections: JSON.stringify(row.selections || {}),
      unitPrice: Number(row.price) || prev?.unitPrice || 0,
    });
  });
  const cleaned = Array.from(merged.values());

  const menuItems = await prisma.menuItem.findMany({
    where: { id: { in: cleaned.map((row) => row.menuItemId) }, isAvailable: true, storeId },
    select: { id: true, price: true },
  });
  const allowed = new Map(menuItems.map((item) => [item.id, item.price]));

  await replaceCartLines(
    userId,
    storeId,
    cleaned
      .filter((row) => allowed.has(row.menuItemId))
      .map((row) => ({
        ...row,
        unitPrice: row.unitPrice || allowed.get(row.menuItemId) || 0,
      }))
  );

  return NextResponse.json({ ok: true });
}
