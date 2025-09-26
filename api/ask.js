// api/ask.js (Vercel)
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  try {
    const apiKey = process.env.PPLX_API_KEY;
    if (!apiKey) return res.status(500).json({ error: "Missing PPLX_API_KEY" });

    const { messages, model = "sonar", temperature = 0.2, max_tokens = 1024 } = req.body || {};

    const r = await fetch("https://api.perplexity.ai/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ model, messages, temperature, max_tokens })
    });

    const data = await r.json();
    return res.status(r.status).json(data);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Proxy error" });
  }
}
