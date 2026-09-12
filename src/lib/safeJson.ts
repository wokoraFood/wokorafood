export async function readJson<T>(res: Response, fallback: T): Promise<T> {
  const text = await res.text();
  if (!text) return fallback;
  try {
    return JSON.parse(text) as T;
  } catch {
    return fallback;
  }
}
