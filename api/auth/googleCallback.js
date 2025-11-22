import { google } from "googleapis";
import jwt from "jsonwebtoken";

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const SESSION_SECRET = process.env.SESSION_SECRET;

const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

const allowedDomains = ["stu.pathfinder-mm.org"];
const allowedSingleEmail = "avagarimike11@gmail.com";

export default async function handler(req, res) {
  try {
    const code = req.query.code;
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    const oauth2 = google.oauth2({ version: "v2", auth: oauth2Client });
    const { data } = await oauth2.userinfo.get(); // data.email, data.name, etc.

    const email = data.email;
    const domain = email.split("@")[1];
    const isVerified = allowedDomains.includes(domain) || email === allowedSingleEmail;

    if (!isVerified) {
      return res.redirect("/?error=not_verified");
    }

    // Create JWT token
    const token = jwt.sign({ uid: data.id, email: data.email, name: data.name }, SESSION_SECRET, {
      expiresIn: "7d"
    });

    // Set cookie
    res.setHeader("Set-Cookie", `token=${token}; HttpOnly; Path=/; Max-Age=${7 * 24 * 60 * 60}; SameSite=Lax`);

    return res.redirect("/dashboard");
  } catch (err) {
    console.error(err);
    res.redirect("/?error=server_error");
  }
}
