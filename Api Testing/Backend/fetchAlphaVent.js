require("dotenv").config();
const axios = require("axios");

const fetchData = async () => {
  const apikey = process.env.API_KEY;
  const symbol = "IBM";
  try {
    const response = await axios.get(
      `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${symbol}&apikey=${apikey}`
    );
    console.log(response?.data);
  } catch (error) {
    console.log(error);
  }
};

fetchData();
