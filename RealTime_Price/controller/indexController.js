const { fetchIndexData } = require("../services/yaahoFinanceService");
const db = require("../db_conig/db");

// index symobls of sotck market
const indices = {
  RelianceIndustries: "RELIANCE.NS",
  AdaniEnterprises: "ADANIENT.NS",
  AdaniPorts: "ADANIPORTS.NS",
  ApolloHospitals: "APOLLOHOSP.NS",
  AsianPaints: "ASIANPAINT.NS",
  AxisBank: "AXISBANK.NS",
  BajajAuto: "BAJAJ-AUTO.NS",
  BajajFinance: "BAJFINANCE.NS",
  BajajFinserv: "BAJAJFINSV.NS",
  BharatElectronics: "BEL.NS",
  BharatPetroleum: "BPCL.NS",
  BhartiAirtel: "BHARTIARTL.NS",
  BritanniaIndustries: "BRITANNIA.NS",
  Cipla: "CIPLA.NS",
  CoalIndia: "COALINDIA.NS",
  DrReddys: "DRREDDY.NS",
  EicherMotors: "EICHERMOT.NS",
  GrasimIndustries: "GRASIM.NS",
  HCLTech: "HCLTECH.NS",
  HDFCBank: "HDFCBANK.NS",
  HDFCLife: "HDFCLIFE.NS",
  HeroMotoCorp: "HEROMOTOCO.NS",
  HindalcoIndustries: "HINDALCO.NS",
  HindustanUnilever: "HINDUNILVR.NS",
  ICICIBank: "ICICIBANK.NS",
  IndusIndBank: "INDUSINDBK.NS",
  Infosys: "INFY.NS",
  ITC: "ITC.NS",
  JSWSteel: "JSWSTEEL.NS",
  KotakMahindraBank: "KOTAKBANK.NS",
  LarsenToubro: "LT.NS",
  MahindraMahindra: "M&M.NS",
  MarutiSuzuki: "MARUTI.NS",
  NestleIndia: "NESTLEIND.NS",
  NTPC: "NTPC.NS",
  ONGC: "ONGC.NS",
  PowerGrid: "POWERGRID.NS",
  SBILife: "SBILIFE.NS",
  ShriramFinance: "SHRIRAMFIN.NS",
  StateBankOfIndia: "SBIN.NS",
  SunPharma: "SUNPHARMA.NS",
  TCS: "TCS.NS",
  TataConsumer: "TATACONSUM.NS",
  TataMotors: "TATAMOTORS.NS",
  TataSteel: "TATASTEEL.NS",
  TechMahindra: "TECHM.NS",
  Titan: "TITAN.NS",
  Trent: "TRENT.NS",
  UltraTechCement: "ULTRACEMCO.NS",
  Wipro: "WIPRO.NS", // Correct NSE symbol

};

const fetchAndStoreData = async () => {
  // Iterate over each index in the indices object
  for (const [name, symbol] of Object.entries(indices)) {
    // Fetch the index data using the fetchIndexData function
    const data = await fetchIndexData(symbol);
    //check
    if (data) {
      console.log(`fetch data for ${name}`, data);
    }

    //query for store data into table
    await db.query(
      `INSERT INTO index_data (index_name,date,open_price,high_price,low_price,current_price)
             VALUES (?,?,?,?,?,?)`,
      [name, data.date, data.open, data.high, data.low, data.current]
    );
  }
};

module.exports = { fetchAndStoreData, indices };
