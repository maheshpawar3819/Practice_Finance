import React, { useEffect, useState } from "react";

const CompanyList = () => {
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/api/show")
      .then((res) => res.json())
      .then((data) => {
        setCompanies(data.data); // Accessing the 'data' array
      })
      .catch((err) => console.error("Error fetching data:", err));
  }, []);

  return (
    <div className="p-5">
      <h2 className="text-2xl font-bold">Nifty 500 Companies</h2>
      <table className="w-full border-collapse border border-gray-300 mt-4">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Logo</th>
            <th className="border p-2">Symbol</th>
            <th className="border p-2">Company Name</th>
            <th className="border p-2">Sector</th>
          </tr>
        </thead>
        <tbody>
          {companies.map((company) => (
            <tr key={company.Nifty500_ID} className="text-center">
              <td className="border p-2">
                {company.icons ? (
                  <img
                    src={company.icons}
                    alt={company.Company_Name}
                    className="w-12 h-12 mx-auto"
                  />
                ) : (
                  "No Image"
                )}
              </td>
              <td className="border p-2">{company.SYMBOL}</td>
              <td className="border p-2">{company.Company_Name}</td>
              <td className="border p-2">{company.Sector}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CompanyList;
