const csv = require("csvtojson");
const fs = require("fs");

const inputFile = "./Active NSE StocksList_202503.02.csv";  
const outputFile = "Active_NSE_StockList.json";

csv()
  .fromFile(inputFile)
  .then((jsonArray) => {
    fs.writeFileSync(outputFile, JSON.stringify(jsonArray, null, 4), "utf-8");
    console.log("CSV file converted to JSON successfully!");
  })
  .catch((err) => console.error("Error converting CSV to JSON:", err));


// // Read the JSON file
// const rawData = fs.readFileSync("Sheet5.json", "utf-8");
// const jsonArray = JSON.parse(rawData);
// const companyMap = jsonArray.reduce((acc, item) => {
//   acc[item["Company_Name"]] = item["Symbol"];
//   return acc;
// }, {});
// console.log(companyMap);

