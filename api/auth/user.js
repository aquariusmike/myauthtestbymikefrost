import jwt from "jsonwebtoken";

export default function handler(req, res) {
  const cookie = req.headers.cookie?.split("; ").find(c => c.startsWith("appToken="));
  if (!cookie) return res.json({ user: null });

  const token = cookie.split("=")[1];
  try {
    const payload = jwt.verify(token, process.env.SESSION_SECRET);
    return res.json({ user: payload });
  } catch {
    return res.json({ user: null });
  }
}
