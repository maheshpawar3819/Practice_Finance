import { useState } from "react";
import axios from "axios"

import "./App.css";
import AnaylistData from "./AnaylistData";

function App() {
  const [formData, setFormData] = useState({
    company: "",
    ltp: "",
    change_percent: "",
    market_cap: "",
    fifty_two_week_high: "",
    fifty_two_week_low: "",
    sector: "",
    current_pe: "",
    clarification: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3000/admin/home-table", formData);
      alert("Data added successfully!");
      setFormData({
        company: "",
        ltp: "",
        change_percent: "",
        market_cap: "",
        fifty_two_week_high: "",
        fifty_two_week_low: "",
        sector: "",
        current_pe: "",
        clarification: "",
      });
    } catch (error) {
      console.error("Error adding data:", error);
      alert("Error adding data!");
    }
  };

  return (
    <>
      <div style={{ padding: "20px" }}>
        <h2>Admin Panel: Add Stock Data</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="company"
            placeholder="Company Name"
            value={formData.company}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            step="0.01"
            name="ltp"
            placeholder="Last Traded Price"
            value={formData.ltp}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            step="0.01"
            name="change_percent"
            placeholder="Change %"
            value={formData.change_percent}
            onChange={handleChange}
          />
          <input
            type="number"
            name="market_cap"
            placeholder="Market Cap (in Crores)"
            value={formData.market_cap}
            onChange={handleChange}
          />
          <input
            type="number"
            step="0.01"
            name="fifty_two_week_high"
            placeholder="52-Week High"
            value={formData.fifty_two_week_high}
            onChange={handleChange}
          />
          <input
            type="number"
            step="0.01"
            name="fifty_two_week_low"
            placeholder="52-Week Low"
            value={formData.fifty_two_week_low}
            onChange={handleChange}
          />
          <input
            type="text"
            name="sector"
            placeholder="Sector"
            value={formData.sector}
            onChange={handleChange}
          />
          <input
            type="number"
            step="0.01"
            name="current_pe"
            placeholder="Current P/E Ratio"
            value={formData.current_pe}
            onChange={handleChange}
          />
          <textarea
            name="clarification"
            placeholder="Clarification/Notes"
            value={formData.clarification}
            onChange={handleChange}
          />
          <button type="submit">Add Stock</button>
        </form>
      </div>
      <AnaylistData/>
    </>
  );
}

export default App;
