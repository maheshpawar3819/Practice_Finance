import React, { useEffect, useState } from "react";
import axios from "axios";
import { useTable, usePagination } from "react-table";

const CompanyTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [filter, setFilter] = useState({
    sector: "",
    marketCap: "",
    marketCapComparison: "gt",
  });
  const [specificPage, setSpecificPage] = useState("");

  //fetch all companies
  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:8080/api/companies?page=${currentPage}&pageSize=${pageSize}`
      );
      // console.log(response?.data?.pagination?.totalPages)
      setData(response?.data?.result);
      setTotalPages(response?.data?.pagination?.totalPages);
    } catch (error) {
      console.error("Error fetching companies:", error);
    } finally {
      setLoading(false);
    }
  };

  //for filter
  const applyFilters = async () => {
    setLoading(true);
    try {
      const { sector, marketCap, marketCapComparison } = filter;
      let url = `http://localhost:8080/api/companies?page=${currentPage}&pageSize=${pageSize}`;

      if (sector) {
        url = `http://localhost:8080/api/companies/sector/${sector}`;
      } else if (marketCap) {
        url = `http://localhost:8080/api/companies/market-cap/${marketCapComparison}/${marketCap}`;
      }

      const response = await axios.get(url);
      setData(response?.data?.result);
      setTotalPages(response?.data?.pagination?.totalPages || 1);
    } catch (error) {
      console.error("Error applying filters:", error);
    } finally {
      setLoading(false);
    }
  };

  //for handle navigation to specific
  const goto = () => {
    //error handle
    if (specificPage < 1 || specificPage > totalPages) {
      alert(`Please enter a valid page number between 1 and ${totalPages}.`);
    } else {
      setCurrentPage(Number(specificPage));
      //api call for specific page
      fetchCompanies();
    }
  };

  //reset filters
  const resetFilters = () => {
    setFilter({ sector: "", marketCap: "", marketCapComparison: "gt" });
    setCurrentPage(1);
    fetchCompanies();
  };

  useEffect(() => {
    fetchCompanies();
  }, [currentPage]);

  const columns = React.useMemo(
    () => [
      { Header: "ID", accessor: "ID" },
      { Header: "Company Name", accessor: "Company_Name" },
      { Header: "Symbol", accessor: "Symbol" },
      { Header: "Sector", accessor: "Sector" },
      { Header: "Market Cap", accessor: "Market_cap" },
      { Header: "Market Cap in Lakh", accessor: "Market_cap_in_Lakh" },
      { Header: "Price", accessor: "Price" },
      { Header: "P/E Ratio", accessor: "P_E" },
      { Header: "Change", accessor: "Change" },
      { Header: "Dividend Yield", accessor: "Div_yield" },
      { Header: "EPS (Diluted)", accessor: "EPS_dil" },
      { Header: "EPS Growth (YoY)", accessor: "EPS_dil_growth_TTM_YoY" },
      { Header: "Volume", accessor: "Volume" },
      { Header: "Relative Volume", accessor: "Rel_Volume" },
      { Header: "NIFTY 50", accessor: "NIFTY_50" },
      { Header: "NIFTY 100", accessor: "NIFTY_100" },
    ],
    []
  );

  const tableInstance = useTable(
    {
      columns,
      data,
      manualPagination: true,
      pageCount: totalPages,
    },
    usePagination
  );

  const { getTableProps, getTableBodyProps, headerGroups, prepareRow, page } =
    tableInstance;

  return (
    <div className="p-6">
      {/* Filters Section */}
      <div className="flex flex-wrap gap-4 mb-6">
        {/* Filter by Sector */}
        <input
          type="text"
          placeholder="Filter by sector"
          className="p-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-green-300"
          value={filter.sector}
          onChange={(e) => setFilter({ ...filter, sector: e.target.value })}
        />
        {/* Filter by Market Cap */}
        <input
          type="number"
          placeholder="Market cap value"
          className="p-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-green-300"
          value={filter.marketCap}
          onChange={(e) => setFilter({ ...filter, marketCap: e.target.value })}
        />
        <select
          value={filter.marketCapComparison}
          className="p-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-green-300"
          onChange={(e) =>
            setFilter({ ...filter, marketCapComparison: e.target.value })
          }
        >
          <option value="gt">Greater Than</option>
          <option value="lt">Less Than</option>
          <option value="eq">Equal To</option>
        </select>
        <button
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md shadow-md cursor-pointer"
          onClick={applyFilters}
        >
          Apply Filters
        </button>
        <button
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md shadow-md cursor-pointer"
          onClick={resetFilters}
        >
          Reset Filters
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table
          {...getTableProps()}
          className="table-auto border-collapse w-full max-w-[1200px] bg-white shadow rounded-md mx-auto"
        >
          <thead className="bg-gray-800 text-white">
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th
                    {...column.getHeaderProps()}
                    className="text-left px-3 py-2 font-medium text-sm"
                  >
                    {column.render("Header")}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {loading ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="text-center py-4 text-gray-500"
                >
                  Loading...
                </td>
              </tr>
            ) : (
              page.map((row) => {
                prepareRow(row);
                return (
                  <tr
                    {...row.getRowProps()}
                    className="odd:bg-white even:bg-gray-100 hover:bg-gray-200 transition duration-200"
                  >
                    {row.cells.map((cell) => (
                      <td
                        {...cell.getCellProps()}
                        className="border-t px-3 py-1 text-gray-700 text-sm"
                      >
                        {cell.render("Cell")}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-6 max-w-[1200px] mx-auto">
        <button
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md shadow-md"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        >
          Previous
        </button>
        <div className="flex items-center gap-4">
          <span className="text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <input
            type="number"
            className="p-2 border rounded-md w-16 text-center shadow-sm focus:outline-none focus:ring focus:ring-green-300"
            placeholder="Page"
            value={specificPage}
            onChange={(e) => setSpecificPage(e.target.value)}
          />
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md shadow-md"
            onClick={goto}
          >
            Go
          </button>
        </div>
        <button
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md shadow-md"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default CompanyTable;
