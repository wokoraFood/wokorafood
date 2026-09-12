# Wokora Foods

Production-ready cafe site for **wokorafoods.com** — dark neon QSR branding, table-side ordering, and counter receipt printing.

## Stack

- Next.js 14 App Router, TypeScript, TailwindCSS, Framer Motion
- NextAuth.js (JWT, phone/email + optional Google)
- Prisma + PostgreSQL
- Zustand cart
- Print abstraction in `src/lib/printReceipt.ts`

## Local setup

```bash
cp .env.example .env
npm install
npx prisma db push
npm run db:seed
npm run dev
```

Local development uses SQLite (`prisma/dev.db`) so you can run without Docker. For production, switch `provider` in `prisma/schema.prisma` to `postgresql`, point `DATABASE_URL` at Neon/Railway/Render, then `prisma db push` (or migrate). `docker-compose.yml` is included if you prefer a local Postgres instead.

Demo accounts after seed:

- Admin: `9999999999` / `Admin@1234`
- Customer: `9876543210` / `Taste@1234`

## Pages

- `/` home, `/menu`, `/cart`, `/login`, `/signup`
- `/order/[orderId]` confirmation + status
- `/account` history, loyalty, re-order
- `/admin` live orders, menu CRUD, print kiosk, table QR
- `/table/12` QR deep-link that pre-fills table 12

## Receipt printing

`POST /api/orders` always calls `printReceipt(order)`.

| `PRINT_MODE` | Behaviour |
| --- | --- |
| `kiosk` (default) | Jobs land in `PrintJob`. Open `/admin/kiosk` on the counter PC and leave it open. The tab polls `/api/print-queue` and runs `window.print()`. |
| `agent` | Also POSTs to `PRINT_AGENT_URL`. Run `print-agent/` on a Pi/PC next to the thermal printer (`node-thermal-printer` / ESC-POS). The agent can poll the queue if the cafe LAN is not inbound-reachable. |
| `escpos` | Scaffold for a networked printer at `PRINTER_IP:9100`. Needs a cafe-side relay or VPN from serverless. |

Swap approaches by changing env vars only — order APIs stay the same.

## Deploy

- Frontend: Vercel
- Database: Neon / Railway / Render Postgres
- Set `DATABASE_URL`, `NEXTAUTH_URL`, `NEXTAUTH_SECRET`
- Optional: `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`
- Real dish photos: drop files into `public/images/menu/` and update `imageUrl` in admin

## Menu images

Seeded items use Unsplash placeholders. Replace with `/images/menu/{slug}.jpg` when photography is ready.
