export default function handler(req, res) {
  // Clear the JWT cookie
  res.setHeader(
    "Set-Cookie",
    "token=; HttpOnly; Path=/; Max-Age=0; Secure; SameSite=Lax"
  );

  // Redirect to homepage
  res.redirect(process.env.VITE_FRONTEND_URL || "/");
}
