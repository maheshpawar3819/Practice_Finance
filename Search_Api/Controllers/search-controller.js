const db = require("../Db/db");

const searchFunction = async (req, res) => {
  try {
    const { key } = req.params;

    //to enable partial matching
    const searchKey = `%${key}%`;

    const [rows] = await db.query(
      `SELECT * FROM dummy_stocks_list WHERE company LIKE ? OR sector LIKE ?`,
      [searchKey, searchKey]
    );

    if (rows.length === 0) {
      return res.status(401).json({
        error: true,
        message: "Data not found",
      });
    }

    //response
    return res.status(200).json({
      success: true,
      data: rows,
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Something wrong unable to search",
    });
  }
};

module.exports = { searchFunction };
