import { useEffect, useState } from "react";
import "./App.css";
import { io } from "socket.io-client";

function App() {
  const [stockData, setStockData] = useState([]);

  useEffect(() => {
    // Connect to the server using socketIo
    const socket = io(`http://localhost:8080`);

    //listning for stock price updates
    socket.on("stockUpdates", (data) => {
      setStockData(data);
    });

    //fetch every second deta
    const interval=setInterval(() => {
      socket.emit()
    }, 1000);
    
    //slean the connection when the component is unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  console.log(stockData);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <header className="text-center py-4">
        <h1 className="text-2xl font-bold text-gray-800">
          Real-Time Stock Market Data
        </h1>
      </header>
      <div className="container mx-auto">
        <table className="w-full bg-white rounded-lg shadow-md overflow-hidden">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="py-2 px-4 text-left">Date</th>
              <th className="py-2 px-4 text-left">Index Name</th>
              <th className="py-2 px-4 text-left">Current Price</th>
              <th className="py-2 px-4 text-left">High</th>
              <th className="py-2 px-4 text-left">Low</th>
              <th className="py-2 px-4 text-left">Open</th>
            </tr>
          </thead>
          <tbody>
            {stockData.length > 0 ?stockData.map((stock) => {
              return (
                <tr key={stock.id} className="border-b border-gray-200">
                  <td className="py-2 px-4">{stock.date}</td>
                  <td className="py-2 px-4">{stock.index_name}</td>
                  <td className="py-2 px-4">{stock.current_price}</td>
                  <td className="py-2 px-4">{stock.high_price}</td>
                  <td className="py-2 px-4">{stock.low_price}</td>
                  <td className="py-2 px-4">{stock.open_price}</td>
                </tr>
              );
            }): <p>Loading..</p>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
