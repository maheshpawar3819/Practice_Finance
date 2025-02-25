const csv = require("csvtojson");
const fs = require("fs");

const inputFile = "ind_nifty500list.csv";  
const outputFile = "nifty_500.json";

csv()
  .fromFile(inputFile)
  .then((jsonArray) => {
    fs.writeFileSync(outputFile, JSON.stringify(jsonArray, null, 4), "utf-8");
    console.log("CSV file converted to JSON successfully!");
  })
  .catch((err) => console.error("Error converting CSV to JSON:", err));

