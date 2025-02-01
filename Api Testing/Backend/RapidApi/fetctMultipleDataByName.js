require("dotenv").config({ path: "../.env" });
const axios = require("axios");

const stockNames = ["INFY.NS", "RELIANCE.NS"];

const fetchStockData = async () => {
  try {
    const requests = stockNames.map((stock) =>
      axios.get("https://indian-stock-exchange-api2.p.rapidapi.com/stock", {
        params: { name: stock },
        headers: {
          "x-rapidapi-key": process.env.RPID_API_KEY,
          "x-rapidapi-host": "indian-stock-exchange-api2.p.rapidapi.com",
        },
      })
    );

    const responses = await Promise.all(requests);
    console.log(responses);
    const data = responses.map((response) => response.data);
    console.log(data);
  } catch (error) {
    console.error(error.response?.data || error.message);
  }
};

fetchStockData();
