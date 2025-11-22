export default function handler(req, res) {
  res.setHeader(
    "Set-Cookie",
    "appToken=; HttpOnly; Path=/; Max-Age=0; Secure; SameSite=Lax"
  );
  res.json({ ok: true });
}
