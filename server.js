// server.js
import express from "express";
import fetch from "node-fetch"; // Node 18+: global fetch exists; keep for portability
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const PPLX_API_KEY = process.env.PPLX_API_KEY; // set in environment, not in code
if (!PPLX_API_KEY) {
  console.error("Missing PPLX_API_KEY env var"); // do not run without it
  process.exit(1);
}

app.post("/api/ask", async (req, res) => {
  try {
    const { messages, model = "sonar", temperature = 0.2, max_tokens = 1024 } = req.body;

    const r = await fetch("https://api.perplexity.ai/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${PPLX_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages,         // [{role:"system"/"user"/"assistant", content:"..."}]
        temperature,
        max_tokens,
      }),
    });

    const data = await r.json();
    if (!r.ok) {
      // Bubble up Perplexity error to client for easier debugging
      return res.status(r.status).json(data);
    }
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Proxy error" });
  }
});

app.use(express.static(".")); // serve index.html for quick local testing

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Server listening on http://localhost:${port}`));
