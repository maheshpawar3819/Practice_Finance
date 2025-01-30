require("dotenv").config();
const axios = require("axios");

const fetchDataFromApi = async () => {
  try {
    const apiKey = process.env.API_KEY;
    const symbol = "RELIANCE.BSE";
    const response = await axios.get(
      `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${symbol}&apikey=${apiKey}
`
    );

    console.log(response?.data);
  } catch (error) {
    console.log(error);
  }
};

fetchDataFromApi();
