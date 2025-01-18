const axios = require("axios");

const fetchIndexData = async (indexSymbol) => {
  try {
    //api
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${indexSymbol}`;

    const response = await axios.get(url, {
      params: {
        range: "1d", // Time range of the data
        interval: "1m", // Data interval
      },
    });

    // Extract the result from the response
    const result = response.data.chart.result[0];
    //extracting values;
    const { high, low, open, close } = result.indicators.quote[0];
    const currentPrice = close[close.length - 1]; // it will give last price

    const timestamp = result.timestamp[result.timestamp.length - 1]; //To Get the most recent timestamp

    //for date converting in to yyyy-mm-dd
    const date = new Date(timestamp * 1000).toISOString().split("T")[0];

    // returning object that containing values
    return {
      date,
      open: open[0],
      high: high[0],
      low: low[0],
      current: currentPrice,
    };
  } catch (error) {
    console.error(`error to fetching data from ${indexSymbol}:`, error.message);
    return null;
  }
};

module.exports = { fetchIndexData };
