import { google } from "googleapis";
import jwt from "jsonwebtoken";

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const FRONTEND_URL = process.env.VITE_FRONTEND_URL || "https://myauthtestbymikefrost.vercel.app";

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

export default async function handler(req, res) {
  const code = req.query.code;

  if (!code) {
    return res.redirect(`${FRONTEND_URL}/?error=missing_code`);
  }

  try {
    // Get tokens and set credentials
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // Get user profile
    const oauth2 = google.oauth2({ version: "v2", auth: oauth2Client });
    const { data: profile } = await oauth2.userinfo.get();

    // <-- FIX HERE
    const email = profile.email;
    const domain = email.split("@")[1];

    const allowedDomains = ["stu.pathfinder-mm.org"];
    const allowedSingleEmail = ["avagarimike11@gmail.com", "minnyi158@gmail.com"];

    const isVerified =
      allowedDomains.includes(domain) ||
      allowedSingleEmail.includes(email);

    if (!isVerified) {
      return res.redirect(`${FRONTEND_URL}/?error=not_verified`);
    }

    // Create JWT
    const token = jwt.sign(
      {
        uid: profile.id,
        email: profile.email,
        name: profile.name,
      },
      process.env.SESSION_SECRET,
      { expiresIn: "7d" }
    );

    // Set cookie
    res.setHeader(
      "Set-Cookie",
      `token=${token}; HttpOnly; Path=/; Max-Age=604800; Secure; SameSite=Lax`
    );

    return res.redirect(`${FRONTEND_URL}/dashboard`);
  } catch (err) {
    console.error(err);
    return res.redirect(`${FRONTEND_URL}/?error=server_error`);
  }
}
