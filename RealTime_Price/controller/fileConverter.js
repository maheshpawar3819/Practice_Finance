// const csv = require("csvtojson");
const fs = require("fs");

// const inputFile = "all_Companies.csv";  
// const outputFile = "all_Companies.json";

// csv()
//   .fromFile(inputFile)
//   .then((jsonArray) => {
//     fs.writeFileSync(outputFile, JSON.stringify(jsonArray, null, 4), "utf-8");
//     console.log("CSV file converted to JSON successfully!");
//   })
//   .catch((err) => console.error("Error converting CSV to JSON:", err));


// // Read the JSON file
const rawData = fs.readFileSync("all_Companies.json", "utf-8");

// Parse JSON
const jsonArray = JSON.parse(rawData);

// Convert to the required format
const companyMap = jsonArray.reduce((acc, item) => {
  acc[item["Company Name"]] = item["Symbol"];
  return acc;
}, {});

// // Output the result
console.log(companyMap);


