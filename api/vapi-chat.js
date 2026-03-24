const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export default async function handler(req, res) {
  // Always set CORS headers
  for (const [k, v] of Object.entries(cors)) res.setHeader(k, v);

  if (req.method === "OPTIONS") {
    return res.status(204).send("");
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Use POST" });
  }

  try {
    const body =
      typeof req.body === "object" && req.body !== null
        ? req.body
        : JSON.parse(req.body || "{}");

    const { assistantId, input, previousChatId } = body;

    if (!assistantId || !input) {
      return res.status(400).json({ error: "Missing assistantId or input" });
    }

    const r = await fetch("https://api.vapi.ai/chat", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.VAPI_PRIVATE_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        assistantId,
        input,
        previousChatId: previousChatId || undefined,
      }),
    });

    const data = await r.json();
    return res.status(r.status).json(data);
  } catch (e) {
    return res.status(500).json({ error: e?.message || String(e) });
  }
}
