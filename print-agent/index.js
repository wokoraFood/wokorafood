/**
 * Wokora Foods local print-agent
 *
 * Run this on a cafe PC / Raspberry Pi that is USB- or LAN-connected
 * to the thermal receipt printer.
 *
 *   PRINT_AGENT_SECRET=... API_BASE=https://wokorafoods.com npm start
 *
 * It polls GET /api/print-queue every 3 seconds and prints via ESC/POS.
 * You can also POST /print from the main backend when PRINT_MODE=agent.
 */

const http = require("http");

const API_BASE = process.env.API_BASE || "http://localhost:3000";
const SECRET = process.env.PRINT_AGENT_SECRET || "wokora-print-dev-secret";
const PORT = Number(process.env.PORT || 4100);
const PRINTER_INTERFACE = process.env.PRINTER_INTERFACE || "tcp://127.0.0.1:9100";

async function printOrder(order) {
  let ThermalPrinter;
  let PrinterTypes;
  try {
    ({ ThermalPrinter, PrinterTypes } = require("node-thermal-printer"));
  } catch {
    console.log("[print-agent] node-thermal-printer not installed. Receipt payload:");
    console.log(JSON.stringify(order, null, 2));
    return;
  }

  const printer = new ThermalPrinter({
    type: PrinterTypes.EPSON,
    interface: PRINTER_INTERFACE,
  });

  printer.alignCenter();
  printer.println("WOKORA FOODS");
  printer.println("Good Food. Better Mood.");
  printer.drawLine();
  printer.alignLeft();
  printer.println(`Order WOK-${String(order.id).slice(-6).toUpperCase()}`);
  printer.println(order.type === "dine_in" ? `Table ${order.tableNumber}` : "Takeaway");
  printer.println(new Date(order.createdAt).toLocaleString("en-IN"));
  printer.drawLine();
  for (const item of order.items || []) {
    printer.println(`${item.quantity} x ${item.name}  INR ${item.price * item.quantity}`);
  }
  printer.drawLine();
  printer.println(`Total  INR ${Math.round(order.totalAmount)}`);
  printer.cut();
  await printer.execute();
}

async function pollQueue() {
  try {
    const res = await fetch(`${API_BASE}/api/print-queue`, {
      headers: { Authorization: `Bearer ${SECRET}` },
    });
    if (!res.ok) return;
    const { jobs } = await res.json();
    for (const job of jobs || []) {
      await printOrder(typeof job.payload === "string" ? JSON.parse(job.payload) : job.payload);
      await fetch(`${API_BASE}/api/print-queue`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${SECRET}`,
        },
        body: JSON.stringify({ id: job.id, status: "printed" }),
      });
    }
  } catch (error) {
    console.warn("[print-agent] poll failed", error.message);
  }
}

const server = http.createServer(async (req, res) => {
  if (req.method === "POST" && req.url === "/print") {
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const order = JSON.parse(Buffer.concat(chunks).toString() || "{}");
    await printOrder(order);
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ ok: true }));
    return;
  }

  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ ok: true, service: "wokora-print-agent" }));
});

server.listen(PORT, () => {
  console.log(`Wokora print-agent listening on :${PORT}`);
  setInterval(pollQueue, 3000);
});
