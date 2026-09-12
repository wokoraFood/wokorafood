type ResetRecord = { token: string; expiresAt: number };

const store = new Map<string, ResetRecord>();

export function createResetToken(userId: string) {
  const token = crypto.randomUUID().replace(/-/g, "");
  store.set(token, { token: userId, expiresAt: Date.now() + 30 * 60 * 1000 });
  return token;
}

export function consumeResetToken(token: string) {
  const record = store.get(token);
  if (!record) return null;
  if (Date.now() > record.expiresAt) {
    store.delete(token);
    return null;
  }
  store.delete(token);
  return record.token;
}
