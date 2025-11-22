import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";

dotenv.config();
const app = express();

// ----------------------
// Middleware
// ----------------------
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: process.env.FRONTEND_URL, // https://myauthtestbymikefrost.vercel.app
  credentials: true
}));

// ----------------------
// Session
// ----------------------
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true,          // HTTPS required in prod
    httpOnly: true,
    sameSite: "none"       // needed for cross-domain cookies
  }
}));

app.use(passport.initialize());
app.use(passport.session());

// ----------------------
// Passport Google Strategy
// ----------------------
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: `${process.env.BACKEND_URL}/auth/google/callback`
}, (accessToken, refreshToken, profile, done) => {
  done(null, profile); // profile contains email, name, etc.
}));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

// ----------------------
// Auth Routes
// ----------------------
app.get("/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get("/auth/google/callback",
  passport.authenticate("google", { failureRedirect: `${process.env.FRONTEND_URL}/?error=not_verified` }),
  (req, res) => {
    const email = req.user.emails[0].value;
    const domain = email.split("@")[1];

    const allowedDomains = ["stu.pathfinder-mm.org"];
    const allowedSingleEmail = "avagarimike11@gmail.com";

    const isVerified =
      allowedDomains.includes(domain) ||
      email === allowedSingleEmail;

    if (!isVerified) {
      req.logout(() => {
        req.session.destroy(() => {
          return res.redirect(`${process.env.FRONTEND_URL}/?error=not_verified`);
        });
      });
      return;
    }

    // Verified student → dashboard
    res.redirect(`${process.env.FRONTEND_URL}/dashboard`);
  }
);

// Get current logged user
app.get("/auth/user", (req, res) => {
  res.json({ user: req.user || null });
});

// Logout
app.get("/auth/logout", (req, res) => {
  req.logout(() => {
    req.session.destroy();
    res.clearCookie("connect.sid", { secure: true, sameSite: "none" });
    res.sendStatus(200);
  });
});

// ----------------------
app.listen(process.env.PORT || 4000, () => console.log("Server running"));
