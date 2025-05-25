import axios from "axios";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST requests allowed" });
  }

  const { authorization } = req.headers;
  const secretKey = process.env.SECRET_KEY;

  if (!authorization || authorization !== `Bearer ${secretKey}`) {
    return res.status(403).json({ error: "Forbidden: Invalid secret key" });
  }

  const vercelEndpoint = process.env.VERCEL_ENDPOINT;

  try {
    const forward = await axios.post(vercelEndpoint, req.body);
    return res.status(200).json({
      message: "Codex entry forwarded successfully",
      data: forward.data,
    });
  } catch (error) {
    return res.status(500).json({
      error: "Failed to forward to Codex endpoint",
      details: error.message,
    });
  }
}
