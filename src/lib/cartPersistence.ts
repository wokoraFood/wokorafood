import { randomUUID } from "crypto";
import { prisma } from "@/lib/prisma";

type CartExtra = {
  id: string;
  configKey: string;
  customization: string;
  selections: string;
  unitPrice: number;
};

export async function loadCartExtras(userId: string, storeId: string) {
  const rows = await prisma.cartLine.findMany({
    where: { userId, storeId },
    select: {
      id: true,
      configKey: true,
      customization: true,
      selections: true,
      unitPrice: true,
    },
  });
  return new Map(rows.map((row: CartExtra) => [row.id, row]));
}

export async function replaceCartLines(
  userId: string,
  storeId: string,
  lines: {
    menuItemId: string;
    quantity: number;
    configKey: string;
    customization: string;
    selections: string;
    unitPrice: number;
  }[]
) {
  await prisma.cartLine.deleteMany({ where: { userId, storeId } });
  if (lines.length === 0) return;
  await prisma.cartLine.createMany({
    data: lines.map((line) => ({
      id: randomUUID(),
      storeId,
      userId,
      menuItemId: line.menuItemId,
      quantity: line.quantity,
      configKey: line.configKey,
      customization: line.customization,
      selections: line.selections,
      unitPrice: line.unitPrice,
    })),
  });
}

export async function attachItemCustomizations<T extends { items: { id: string }[] }>(records: T[]) {
  const ids = records.flatMap((record) => record.items.map((item) => item.id));
  if (ids.length === 0) return records;
  const rows = await prisma.orderItem.findMany({
    where: { id: { in: ids } },
    select: { id: true, customization: true },
  });
  const map = new Map(rows.map((row) => [row.id, row.customization || ""]));
  return records.map((record) => ({
    ...record,
    items: record.items.map((item) => ({
      ...item,
      customization: map.get(item.id) || "",
    })),
  }));
}

export async function saveOrderItemCustomizations(
  items: { id: string }[],
  customizations: string[]
) {
  await Promise.all(
    items.map((item, index) =>
      prisma.orderItem.update({
        where: { id: item.id },
        data: { customization: customizations[index] || "" },
      })
    )
  );
}
