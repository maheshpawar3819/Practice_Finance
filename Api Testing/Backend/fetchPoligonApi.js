const axios = require("axios");

const fetchData = async () => {
  try {
    const response =
      await axios.get(`https://api.polygon.io/vX/reference/financials?symbol=RELIANCE&limit=10&apiKey=9wdAvwMZLh7zuUKQsT1mLO77p3V77rkq`);

    console.log(response.data);
  } catch (error) {
    console.log(error);
  }
};

fetchData();
