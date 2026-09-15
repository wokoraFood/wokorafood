import { createClient } from "redis";

type RedisConn = ReturnType<typeof createClient>;

let client: RedisConn | null = null;
let connecting: Promise<RedisConn> | null = null;

export async function redis(): Promise<RedisConn | null> {
  const url = process.env.REDIS_URL;
  if (!url) return null;
  if (client?.isOpen) return client;
  if (connecting) return connecting;

  connecting = (async () => {
    const next = createClient({ url });
    next.on("error", (error) => console.warn("[redis]", error.message));
    await next.connect();
    client = next;
    return next;
  })();

  return connecting;
}
