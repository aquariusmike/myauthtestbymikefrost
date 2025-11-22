import jwt from "jsonwebtoken";

const SESSION_SECRET = process.env.SESSION_SECRET;

export default function handler(req, res) {
  const token = req.cookies?.token;
  if (!token) return res.json({ user: null });

  try {
    const payload = jwt.verify(token, SESSION_SECRET);
    res.json({ user: payload }); // now includes name, email, uid
  } catch {
    res.json({ user: null });
  }
}
