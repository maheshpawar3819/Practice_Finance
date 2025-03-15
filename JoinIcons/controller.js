const db = require("./db");

const getAllData = async (req, res) => {
  try {
    const [results] = await db.query("SELECT * FROM Nifty500_Company_List");

    // Convert Buffer to Base64 for icons
    const formattedResults = results.map((row) => {
      if (row.icons) {
        return {
          ...row,
          icons: `data:image/png;base64,${row.icons.toString("base64")}`,
        };
      }
      return row;
    });

    return res.status(200).json({
      message: "success",
      data: formattedResults,
    });
  } catch (error) {
    console.error("Error fetching data:", error);

    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};


const getAllDataList = async (req, res) => {
  try {
    const [results] = await db.query("SELECT * FROM comapanies_stocks_list");

  
    const formattedResults = results.map((row) => {
      if (row.icons) {
        return {
          ...row,
          icons: `data:image/png;base64,${row.icons.toString("base64")}`,
        };
      }
      return row;
    });

    return res.status(200).json({
      message: "success",
      data: formattedResults,
    });
  } catch (error) {
    console.error("Error fetching data:", error);

    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
module.exports = { getAllData ,getAllDataList};
