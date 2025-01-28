import React, { useEffect, useState } from "react";
import axios from "axios";
import { useTable, usePagination } from "react-table";

const CompanyTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [filter, setFilter] = useState({ sector: "", marketCap: null });

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:8080/api/companies?page=${currentPage}&pageSize=${pageSize}`
      );
      setData(response?.data?.result);
      setTotalPages(response?.data?.pagination?.totalPages);
    } catch (error) {
      console.error("Error fetching companies:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBySector = async () => {
    if (!filter.sector) return;
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:8080/api/companies/sector/${filter.sector}`
      );
      setData(response?.data?.result);
      setTotalPages(1);
    } catch (error) {
      console.error("Error fetching by sector:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchByMarketCap = async (comparison, value) => {
    if (!value) return;
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:8080/api/companies/market-cap/${comparison}/${value}`
      );
      setData(response?.data?.result);
      setTotalPages(1);
    } catch (error) {
      console.error("Error fetching by market cap:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!filter.sector && !filter.marketCap) {
      fetchCompanies();
    }
  }, [currentPage, filter]);

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
      <div className="flex flex-wrap gap-4 mb-6">
        <input
          type="text"
          placeholder="Filter by sector"
          className="p-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-green-300"
          value={filter.sector}
          onChange={(e) => setFilter({ ...filter, sector: e.target.value })}
        />
        <button
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md shadow-md"
          onClick={fetchBySector}
        >
          Filter by Sector
        </button>
        <input
          type="text"
          placeholder="Market cap value"
          className="p-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-green-300"
          onChange={(e) => setFilter({ ...filter, marketCap: e.target.value })}
        />
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md shadow-md"
          onClick={() => fetchByMarketCap("gt", filter.marketCap)}
        >
          Market Cap GT
        </button>
      </div>

      {/* //table  */}
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

      {/* pagination  */}
      <div className="flex justify-between items-center mt-6 max-w-[1200px] mx-auto">
        <button
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md shadow-md"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        >
          Previous
        </button>
        <span className="text-gray-700">
          Page {currentPage} of {totalPages}
        </span>
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
