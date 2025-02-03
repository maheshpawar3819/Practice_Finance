require("dotenv").config({ path: "../.env" });
const axios = require("axios");
const fs = require("fs");

const options = {
  method: "GET",
  url: "https://indian-stock-exchange-api2.p.rapidapi.com/stock",
  params: { name: "COALINDIA" },
  headers: {
    "x-rapidapi-key": process.env.RPID_API_KEY,
    "x-rapidapi-host": "indian-stock-exchange-api2.p.rapidapi.com",
  },
};

async function fetchData() {
  try {
    const response = await axios.request(options);
    const data = response.data;
    console.log(data);

    // Convert JSON data to a string
    const jsonData = JSON.stringify(data, null, 2);

    // Write JSON data to a local file
    fs.writeFile("stockData.json", jsonData, (err) => {
      if (err) {
        console.error("Error writing file:", err);
      } else {
        console.log("JSON data has been saved.");
      }
    });
  } catch (error) {
    console.error(error);
  }
}

fetchData();
