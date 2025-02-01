require("dotenv").config();
const express = require("express");
const { Server } = require("socket.io");
const http = require("http");
const { fetchAndStoreData } = require("./controller/indexController");
const db = require("./db_conig/db");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
// cors options
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  })
);
const io = new Server(
  server,
  //cors for io
  {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
    },
  }
);

//route
app.get("/", (req, res) => {
  res.send(`<h1>Welcome to stock data api</h1>`);
});

//set up a socket.iO connection handler
io.on("connection", (socket) => {
  console.log("A client is connected");

  // Timer to fetch and emit stock updates every 60 seconds
  const interval = setInterval(async () => {
    try {
      const [rows] = await db.query(
        `SELECT * FROM index_data ORDER BY created_at DESC LIMIT 2`
      );
      socket.emit("stockUpdates", rows); 
    } catch (err) {
      console.error("Error fetching stock data:", err);
    }
  }, 10000);

  // Handle client disconnect
  socket.on("disconnect", () => {
    console.log("A client is disconnected");
    clearInterval(interval); // Clear interval on disconnect
  });
});

//it will call api every 10 sec
setInterval(async () => {
  await fetchAndStoreData();
}, 10000);

// start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port : ${PORT}`);
});
