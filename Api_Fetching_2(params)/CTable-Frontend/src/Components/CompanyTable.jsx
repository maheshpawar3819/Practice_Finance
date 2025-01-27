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

  //fetch companies based on current page
  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:8080/api/companies?page=${page}&pageSize=${pageSize}`
      );
      setData(response?.data?.result);
      setTotalPages(response?.data?.pagination?.totalPages);
    } catch (error) {
      console.error("Error fetching companies:", error);
    } finally {
      setLoading(false);
    }
  };

  //filtering by sector
  const fetchBySector = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:8080/api/companies/sector/${filter.sector}`
      );
      setFilter(response?.data?.result);
      setTotalPages(1);
    } catch (error) {
      console.error("Error fetching by sector:", error);
    } finally {
      setLoading(false);
    }
  };

  //handle filtering by market cap
  const filteringByMarketCap = async () => {
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

  //   filtering the data on page change
  useEffect(() => {
    if (!filter.sector && !filter.marketCap) {
      fetchCompanies(currentPage);
    }
  }, [currentPage, filter]);

  //define table colums
  const columns = React.useMemo(
    () => [
      { Header: "Id", accessor: "company_id" },
      { Header: "Symbol", accessor: "symbol" },
      { Header: "Name", accessor: "company_name" },
      { Header: "Sector", accessor: "sector" },
      { Header: "Market Cap", accessor: "market_cap" },
      { Header: "Stock Price", accessor: "stock_price" },
    ],
    []
  );

  //react table instance
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
    <div>
      <div className="p-6">
        <div className="flex justify-between mb-4">
          <input
            type="text"
            placeholder="Filter by sector"
            className="p-2 border rounded-md"
            value={filter.sector}
            onChange={(e) => setFilter({ ...filter, sector: e.target.value })}
          />
          <button
            className="bg-green-500 text-white px-4 py-2 rounded-md"
            onClick={fetchBySector}
          >
            Filter
          </button>
        </div>
        <div className="flex mb-4">
          <input
            type="text"
            placeholder="Market cap value"
            className="p-2 border rounded-md mr-2"
            onChange={(e) =>
              setFilter({ ...filter, marketCap: e.target.value })
            }
          />
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
            onClick={() => fetchByMarketCap("gt", filter.marketCap)}
          >
            Market Cap GT
          </button>
        </div>
        <table
          {...getTableProps()}
          className="min-w-full bg-white border rounded-md"
        >
          <thead className="bg-gray-200">
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th
                    {...column.getHeaderProps()}
                    className="text-left px-4 py-2"
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
                <td colSpan={columns.length} className="text-center py-4">
                  Loading...
                </td>
              </tr>
            ) : (
              page.map((row) => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()}>
                    {row.cells.map((cell) => (
                      <td
                        {...cell.getCellProps()}
                        className="border-t px-4 py-2"
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
        <div className="flex justify-between mt-4">
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded-md"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded-md"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompanyTable;
