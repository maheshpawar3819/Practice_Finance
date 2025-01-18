require("dotenv").config();
const express = require("express");
const { Server } = require("socket.io");
const http = require("http");
const { fetchAndStoreData } = require("./controller/indexController");
const db = require("./db_conig/db");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

//route
app.get("/", (req, res) => {
  res.send(`<h1>Welcome to stock data api</h1>`);
});

//set up a socket.iO connection handler
io.on("connection", (socket) => {
  console.log("client is connected");

  //set up a timer function to fetch and emit stock updates every 60 seconds
  const intervel = setInterval(async () => {
    const [rows] = await db.query(
      `SELECT * FROM index_data ORDER BY created_at DESC LIMIT 3`
    );

    //give letest stock data to connected client
    socket.emit("sotckUpdates", rows);
  }, 60000);

  //when client disconnect
  socket.on("disconnect", () => {
    console.log(`A client is disconnectd`);
    //clearing time interval when client is disconnect
    clearInterval(intervel);
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
