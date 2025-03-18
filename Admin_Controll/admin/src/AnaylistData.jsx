import React from "react";
import axios from "axios";
import { useState } from "react";

const AnaylistData = () => {
  const [formData, setFormData] = useState({
    company: "",
    ltp: "",
    change_percent: "",
    market_cap: "",
    current_pe: "",
    clarification: "",
    roe: "",
    pe: "",
    pbv: "",
    ev_ebitda: "",
    five_year_sales_growth: "",
    five_year_profit_growth: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3000/admin/stock-anaylist",
        formData
      );
      alert(response.data.message);
      setFormData({
        company: "",
        ltp: "",
        change_percent: "",
        market_cap: "",
        fifty_two_week_high: "",
        fifty_two_week_low: "",
        sector: "",
        clarification: "",
        roe: "",
        pe: "",
        pbv: "",
        ev_ebitda: "",
        five_year_sales_growth: "",
        five_year_profit_growth: "",
      });
    } catch (error) {
      console.error("Error submitting data:", error);
      alert("Failed to add financial data. Please try again.");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Add Financial Data</h2>
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
        <textarea
          name="clarification"
          placeholder="Clarification/Notes"
          value={formData.clarification}
          onChange={handleChange}
        />
        <input
          type="number"
          name="roe"
          placeholder="Return on Equity (ROE)"
          value={formData.roe}
          onChange={handleChange}
        />
        <input
          type="number"
          name="pe"
          placeholder="Price-to-Earnings Ratio (P/E)"
          value={formData.pe}
          onChange={handleChange}
        />
        <input
          type="number"
          name="pbv"
          placeholder="Price-to-Book Value (P/BV)"
          value={formData.pbv}
          onChange={handleChange}
        />
        <input
          type="number"
          name="ev_ebitda"
          placeholder="EV/EBITDA"
          value={formData.ev_ebitda}
          onChange={handleChange}
        />
        <input
          type="number"
          name="five_year_sales_growth"
          placeholder="5-Year Sales Growth (%)"
          value={formData.five_year_sales_growth}
          onChange={handleChange}
        />
        <input
          type="number"
          name="five_year_profit_growth"
          placeholder="5-Year Profit Growth (%)"
          value={formData.five_year_profit_growth}
          onChange={handleChange}
        />
        <button type="submit">Add Data</button>
      </form>
    </div>
  );
};

export default AnaylistData;
