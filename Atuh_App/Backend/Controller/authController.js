const { OAuth2Client } = require("google-auth-library");
const axios = require("axios");
const db = require("../Db/connection");

const googleClient = new OAuth2Client("Google Client id put here");

//for google signIn
exports.googleSignIn = async (req, res) => {
  const { token } = req.body;
  const ticket = await googleClient.verifyIdToken({
    idToken: token,
    audience: "your.. Google Client id", //i dont have a id for that
  });
  const payload = ticket.getPayload();
  const user = {
    googleId: payload.sub,
    email: payload.email,
    name: payload.name,
  };

  //query for database
  db.query("INSERT INTO users SET ?", user, (err, results) => {
    if (err) return res.status(500).send(err);
    res.status(201).send(results);
  });
};

// For linkedIn sign in
exports.linkedinSignIn = async (req, res) => {
  const { code } = req.body;
  const tokenResponse = await axios.post("//linked in access token", {
    grant_type: "authorization code",
    code: code,
    redirect_uri: "redirect url",
    client_id: "your linkend in client id",
    client_secret: "your linked in client secret",
  });

  const accessToken = tokenResponse.data.access_token;
  const profileResponse = await axios.get("linked in api", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const user = {
    linkedinId: profileResponse.data.id,
    name:
      profileResponse.data.localizedFirstName +
      " " +
      profileResponse.data.localizedLastName,
  };

  db.query("INSERT INTO users SET ?", user, (err, results) => {
    if (err) res.status(500).send(err);
    res.status(201).send(results);
  });
};


