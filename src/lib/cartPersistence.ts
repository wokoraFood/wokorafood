import { Prisma } from "@prisma/client";
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
  const rows = await prisma.$queryRaw<CartExtra[]>`
    SELECT id, configKey, customization, selections, unitPrice
    FROM CartLine
    WHERE userId = ${userId} AND storeId = ${storeId}
  `;
  return new Map(rows.map((row) => [row.id, row]));
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
  const now = new Date();
  for (const line of lines) {
    await prisma.$executeRaw`
      INSERT INTO CartLine (id, storeId, userId, menuItemId, quantity, configKey, customization, selections, unitPrice, createdAt, updatedAt)
      VALUES (
        ${randomUUID()},
        ${storeId},
        ${userId},
        ${line.menuItemId},
        ${line.quantity},
        ${line.configKey},
        ${line.customization},
        ${line.selections},
        ${line.unitPrice},
        ${now},
        ${now}
      )
    `;
  }
}

export async function attachItemCustomizations<T extends { items: { id: string }[] }>(records: T[]) {
  const ids = records.flatMap((record) => record.items.map((item) => item.id));
  if (ids.length === 0) return records;
  const rows = await prisma.$queryRaw<{ id: string; customization: string }[]>`
    SELECT id, customization FROM OrderItem WHERE id IN (${Prisma.join(ids)})
  `;
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
  for (let index = 0; index < items.length; index += 1) {
    await prisma.$executeRaw`
      UPDATE OrderItem SET customization = ${customizations[index] || ""} WHERE id = ${items[index].id}
    `;
  }
}
