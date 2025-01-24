require("dotenv").config();
const express = require("express");
const cors = require("cors");
const passport = require("passport");
const cookieSession = require("cookie-session");
require("./passport"); 
const authRoutes = require("./Routes/auth");
const app = express();

app.use(
  cookieSession({
    name: "session",
    keys: [process.env.COOKIE_KEY],
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: "GET,POST,PUT,PATCH,DELETE",
    credentials: true,
  })
);

// Routes
app.use("/auth", authRoutes);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server is listening on port: ${port}`);
});
