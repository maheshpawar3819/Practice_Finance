import { useEffect, useState } from "react";
import "./App.css";
import { io } from "socket.io-client";

function App() {
  const [stockData, setStockData] = useState([]);

  useEffect(() => {
    // Connect to the server using socketIo
    const socket = io(`http://localhost:8080`);

    // Listening for stock price updates
    socket.on("stockUpdates", (data) => {
      setStockData(data);
    });

    // Clean up the connection when the component is unmounted
    return () => {
      socket.disconnect();
    };
  }, []);

  console.log(stockData);

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-800 via-gray-900 to-black p-6">
      <header className="text-center py-10">
        <h1 className="text-5xl font-extrabold text-white tracking-wide">
          📈 Real-Time Stock Market Data
        </h1>
      </header>
      <div className="container mx-auto p-6 bg-gray-800 rounded-lg shadow-lg">
        <table className="w-full table-auto bg-white rounded-lg shadow-lg overflow-hidden">
          <thead className="bg-gray-700 text-white">
            <tr>
              <th className="py-3 px-6 text-left">Date</th>
              <th className="py-3 px-6 text-left">Index Name</th>
              <th className="py-3 px-6 text-left">Current Price</th>
              <th className="py-3 px-6 text-left">High</th>
              <th className="py-3 px-6 text-left">Low</th>
              <th className="py-3 px-6 text-left">Open</th>
            </tr>
          </thead>
          <tbody className="text-gray-200">
            {stockData.length > 0 ? (
              stockData.map((stock) => {
                return (
                  <tr
                    key={stock.id}
                    className="border-b border-gray-200 hover:bg-gray-300"
                  >
                    <td className="py-3 px-6 text-gray-600">{stock.date}</td>
                    <td className="py-3 px-6 text-gray-700 font-medium">
                      {stock.index_name}
                    </td>
                    <td
                      className={`py-3 px-6 font-bold ${
                        stock.current_price > stock.open_price
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {stock.current_price}
                    </td>
                    <td className="py-3 px-6 text-gray-600 font-medium">
                      {stock.high_price}
                    </td>
                    <td className="py-3 px-6 text-gray-600 font-medium">
                      {stock.low_price}
                    </td>
                    <td
                      className={`py-3 px-6 font-medium ${
                        stock.open_price > stock.current_price
                          ? "text-orange-500"
                          : "text-green-500"
                      }`}
                    >
                      {stock.open_price}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="py-6 text-center text-lg text-gray-600 font-medium"
                >
                  Loading...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
