import { google } from "googleapis";

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const REDIRECT_URI = process.env.REDIRECT_URI; // e.g., https://myauthtestbymikefrost.vercel.app/api/auth/callback
const oauth2Client = new google.auth.OAuth2(CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, REDIRECT_URI);

export default function handler(req, res) {
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: ["profile", "email"]
  });
  res.redirect(url);
}
