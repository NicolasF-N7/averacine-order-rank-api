import 'dotenv/config';

export default async function handler(req, res) {
  // ✅ CORS headers
  res.setHeader("Access-Control-Allow-Origin", "https://averacine.com");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).send("Method not allowed");
  }

  const email = req.body?.email;
  const scriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL;

  if (!email || !scriptUrl) {
    return res.status(400).send("Missing email or script URL");
  }

  try {
    const response = await fetch(scriptUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ email }),
    });

    const text = await response.text();
    return res.status(200).send(text);
  } catch (error) {
    console.error("Fetch failed:", error);
    return res.status(500).send("Failed to fetch from Google Script.");
  }
}
