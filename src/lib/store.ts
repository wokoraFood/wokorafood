import { prisma } from "./prisma";

export const DEFAULT_STORE_ID = "wokora";

export async function ensureDefaultStore() {
  await prisma.store.upsert({
    where: { id: DEFAULT_STORE_ID },
    update: { name: "Wokora Foods" },
    create: {
      id: DEFAULT_STORE_ID,
      slug: DEFAULT_STORE_ID,
      name: "Wokora Foods",
    },
  });
}
