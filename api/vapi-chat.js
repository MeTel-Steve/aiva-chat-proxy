export default async function handler(req, res) {
  // CORS so your website can call this endpoint
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).send("");
  if (req.method !== "POST") return res.status(405).json({ error: "Use POST" });

  try {
    const { assistantId, input, previousChatId } = req.body || {};
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
