require("dotenv").config();
const axios = require("axios");

const options = {
  method: "GET",
  url: "https://indian-stock-exchange-api2.p.rapidapi.com/corporate_actions",
  params: {
    stock_name: "infosys",
  },
  headers: {
    "x-rapidapi-key": process.env.RPID_API_KEY,
    "x-rapidapi-host": "indian-stock-exchange-api2.p.rapidapi.com",
  },
};

const extractStockData = (data) => {
  console.log("📌 Board Meetings:");
  if (data.board_meetings?.data?.length > 0) {
    data.board_meetings.data.forEach((meeting, index) => {
      console.log(`${index + 1}. Date: ${meeting[0]}, Agenda: ${meeting[1]}`);
    });
  } else {
    console.log("No board meetings found.");
  }

  console.log("\n📌 Dividends:");
  if (data.dividends?.data?.length > 0) {
    console.log(data.dividends.header.join(" | "));
    data.dividends.data.forEach(dividend => {
      console.log(dividend.join(" | "));
    });
  } else {
    console.log("No dividend data available.");
  }

  console.log("\n📌 Stock Splits:");
  console.log(data.splits?.msg || "No recent stock splits.");

  console.log("\n📌 Bonus Issues:");
  if (data.bonus?.data?.length > 0) {
    console.log(data.bonus.header.join(" | "));
    data.bonus.data.forEach(bonus => {
      console.log(bonus.join(" | "));
    });
  } else {
    console.log("No bonus data available.");
  }

  console.log("\n📌 Rights Issues:");
  console.log(data.rights?.msg || "No rights issue data.");
};

axios
  .request(options)
  .then((response) => {
    extractStockData(response.data);
  })
  .catch((err) => {
    console.error("Error fetching data:", err);
  });
