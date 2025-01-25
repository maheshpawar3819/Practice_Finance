require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const passport = require("passport");
const session = require("express-session");
const cors = require("cors");
const authRoutes = require("./Routes/authRoutes");
const db = require("./Config/db");

const app = express();
const port = process.env.PORT || 5000;

//Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);
app.use(passport.initialize());
app.use(passport.session());

//Routes
app.use("/auth", authRoutes);

//Database Connection
db.connect((err) => {
  if (err) throw err;
  console.log(`Connected to my sql database`);
});

app.listen(port, () => {
  console.log(`server is listning on port ${port}`);
});
