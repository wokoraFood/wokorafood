# Wokora print-agent (Approach 1)

Local Node service that sits next to the cafe thermal printer.

1. Install `node-thermal-printer` in this folder.
2. Point `PRINTER_INTERFACE` at USB (`printer:EPSON`) or LAN (`tcp://192.168.1.50:9100`).
3. Set `API_BASE` to the production site and `PRINT_AGENT_SECRET` to match the web app.
4. On the Vercel project, set `PRINT_MODE=agent` and `PRINT_AGENT_URL` if the cafe machine has a reachable URL; otherwise leave the agent in poll-only mode.
