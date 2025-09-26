// api/ocr.js
export default async function handler(req, res) {
  // 👇 Add this line here
  console.log("Key loaded?", !!process.env.GEMINI_API_KEY);

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { prompt, fileData, mimeType } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    const model = "models/gemini-1.5-flash";
    const apiUrl = `https://generativelanguage.googleapis.com/v1/${model}:generateContent?key=${apiKey}`;

  const payload = {
    contents: [
      {
        parts: [
          { text: prompt },
          { inlineData: { mimeType, data: fileData } }
        ]
      }
    ],
    generationConfig: { temperature: 0.2, maxOutputTokens: 1024 }
  };

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  const data = await response.json();
  res.status(response.status).json(data);
}
