require("dotenv").config({ path: "../../.env" });
const axios = require("axios");
const fs = require("fs");

console.log(process.env.RPID_API_KEY);

const options = {
  method: "GET",
  url: "https://indian-stock-exchange-api2.p.rapidapi.com/mutual_funds",
  headers: {
    "x-rapidapi-key": process.env.RPID_API_KEY,
    "x-rapidapi-host": "indian-stock-exchange-api2.p.rapidapi.com",
  },
};

const fetchMutualfundData = async () => {
  try {
    const response = await axios.request(options);
    console.log(response?.data);

    const data = response?.data;
    const jsonData = JSON.stringify(data, null, 2);

    fs.writeFile("mutualFund.json", jsonData, (err) => {
      if (err) {
        console.error("Error writing file:", err);
      } else {
        console.log("JSON data has been saved.");
      }
    });
  } catch (error) {
    console.log(error);
  }
};

fetchMutualfundData();
