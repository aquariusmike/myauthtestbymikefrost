import { google } from "googleapis";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  const client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.REDIRECT_URI
  );

  const code = req.query.code;
  const { tokens } = await client.getToken(code);
  client.setCredentials(tokens);

  const oauth2 = google.oauth2({ version: "v2", auth: client });
  const { data } = await oauth2.userinfo.get();

  const email = data.email;
  const allowedDomains = ["stu.pathfinder-mm.org"];
  const allowedSingleEmail = "avagarimike11@gmail.com";

  const isVerified =
    allowedDomains.includes(email.split("@")[1]) || email === allowedSingleEmail;

  if (!isVerified) {
    return res.redirect(`${process.env.VITE_FRONTEND_URL}/?error=not_verified`);
  }

  // Create JWT cookie
  const token = jwt.sign({ email: data.email, name: data.name }, process.env.SESSION_SECRET, {
    expiresIn: "7d"
  });

  res.setHeader(
    "Set-Cookie",
    `appToken=${token}; HttpOnly; Path=/; Max-Age=604800; Secure; SameSite=Lax`
  );

  res.redirect(`${process.env.VITE_FRONTEND_URL}/dashboard`);
}
