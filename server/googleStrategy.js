import { google } from "googleapis";
import jwt from "jsonwebtoken";

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI; // production: https://myauthtestbymikefrost.vercel.app/api/auth/googleCallback

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

export const googleStrategy = {
  generateAuthUrl() {
    return oauth2Client.generateAuthUrl({
      access_type: "offline",
      prompt: "consent",
      scope: ["profile", "email"]
    });
  },

  async getUserProfile(code) {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    const oauth2 = google.oauth2({ version: "v2", auth: oauth2Client });
    const { data } = await oauth2.userinfo.get();
    return data; // returns { email, name, picture, ... }
  },

  createSessionToken(profile) {
    return jwt.sign(
      { uid: profile.id, email: profile.email },
      process.env.SESSION_SECRET,
      { expiresIn: "7d" }
    );
  }
};
