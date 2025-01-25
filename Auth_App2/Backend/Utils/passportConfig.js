const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const LinkedInStrategy = require("passport-linkedin-oauth2").Strategy;
const bcrypt = require("bcrypt");
const db = require("../Config/db");
const passport = require("passport");

function initializePassport(passport) {
  // Local Strategy
  passport.use(
    new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
      db.query(
        "SELECT * FROM users WHERE email = ?",
        [email],
        async (err, results) => {
          if (err) return done(err);
          if (!results.length)
            return done(null, false, { message: "No user found" });

          const user = results[0];
          if (await bcrypt.compare(password, user.password)) {
            return done(null, user);
          } else {
            return done(null, false, { message: "Incorrect password" });
          }
        }
      );
    })
  );
}

// Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      db.query(
        "SELECT * FROM users WHERE email = ?",
        [profile.emails[0].value],
        (err, results) => {
          if (err) return done(err);
          if (results.length) {
            // Existing user
            return done(null, results[0]);
          } else {
            // Create a new user
            db.query(
              "INSERT INTO users (email, provider) VALUES (?, 'google')",
              [profile.emails[0].value],
              (err, result) => {
                if (err) return done(err);
                // Retrieve the new user by ID
                db.query(
                  "SELECT * FROM users WHERE id = ?",
                  [result.insertId],
                  (err, results) => {
                    if (err) return done(err);
                    return done(null, results[0]); // Pass the new user with id
                  }
                );
              }
            );
          }
        }
      );
    }
  )
);

// LinkedIn Strategy
passport.use(
  new LinkedInStrategy(
    {
      clientID: process.env.LINKEDIN_CLIENT_ID,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
      callbackURL: "/auth/linkedin/callback",
      scope: ["r_emailaddress", "r_liteprofile"],
    },
    (accessToken, refreshToken, profile, done) => {
      db.query(
        "SELECT * FROM users WHERE email = ?",
        [profile.emails[0].value],
        (err, results) => {
          if (err) return done(err);
          if (results.length) {
            return done(null, results[0]);
          } else {
            db.query(
              "INSERT INTO users (email) VALUES (?)",
              [profile.emails[0].value],
              (err) => {
                if (err) return done(err);
                return done(null, { email: profile.emails[0].value });
              }
            );
          }
        }
      );
    }
  )
);

passport.serializeUser((user, done) => {
  // console.log("Serializing user:", user);
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  db.query("SELECT * FROM users WHERE id = ?", [id], (err, results) => {
    if (err) return done(err);
    if (!results.length) {
      return done(new Error("User not found"));
    }
    done(null, results[0]);
  });
});

module.exports = { initializePassport };
