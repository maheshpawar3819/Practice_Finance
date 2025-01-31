require("dotenv").config({ path: "../.env" });
const axios = require("axios");

const option = {
  method: "GET",
  url: "https://indian-stock-exchange-api2.p.rapidapi.com/stock",
  params: { name: "tata steel" },
  headers: {
    "x-rapidapi-key": process.env.RPID_API_KEY,
    "x-rapidapi-host": "indian-stock-exchange-api2.p.rapidapi.com",
  },
};

try {
  axios
    .request(option)
    .then((response) => {
      console.log(response?.data);
    })
    .catch((err) => {
      console.log(err);
    });
} catch (error) {
  console.log(error);
}


