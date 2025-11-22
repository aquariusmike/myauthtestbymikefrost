import { google } from "googleapis";

export default async function handler(req, res) {
  const redirectUri = process.env.REDIRECT_URI;
  const client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    redirectUri
  );

  const url = client.generateAuthUrl({
    access_type: "offline",
    scope: ["profile", "email"]
  });

  res.redirect(url);
}
