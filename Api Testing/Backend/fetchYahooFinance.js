const yahooFinance = require("yahoo-finance2").default;

const getStockData = async (symbol) => {
  try {
    const historicalData = await yahooFinance.historical(symbol, {
      period1: "2023-01-01",
      period2: "2024-01-01",
      interval: "1mo", // Monthly data
    });

    const dividendData = await yahooFinance.quoteSummary(symbol, {
      modules: [
        "incomeStatementHistory",
        "balanceSheetHistory",
        "cashflowStatementHistory",
        "defaultKeyStatistics",
        "calendarEvents",
        "summaryDetail", // Fix: Replaced "dividends" with "summaryDetail"
      ],
    });

    const stockNews = await yahooFinance.search(symbol);

    console.log({ historicalData, dividendData, stockNews });
  } catch (error) {
    console.log(error);
  }
};

getStockData("RELIANCE.NS");
