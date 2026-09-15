import { redis } from "./redis";

const MENU_TTL_SECONDS = Number(process.env.MENU_CACHE_TTL || 60);

export async function cacheGet<T>(key: string): Promise<T | null> {
  const r = await redis();
  if (!r) return null;
  const raw = await r.get(key);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export async function cacheSet(key: string, value: unknown, ttl = MENU_TTL_SECONDS) {
  const r = await redis();
  if (!r) return;
  await r.set(key, JSON.stringify(value), { EX: ttl });
}

export async function cacheDel(key: string) {
  const r = await redis();
  if (!r) return;
  const keys = await r.keys(`${key}*`);
  if (keys.length) await r.del(keys);
}

export function menuCacheKey(storeId: string, extra = "") {
  return `menu:${storeId}${extra ? `:${extra}` : ""}`;
}
