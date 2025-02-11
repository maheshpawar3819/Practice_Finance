import React from "react";
import "./App.css";
import { useGetCompaniesQuery } from "./store/slices/apiCalls/apiSlice";

function App() {
  const { data, error, isLoading } = useGetCompaniesQuery();

  if (isLoading) return <p>Loading..</p>;
  if (error) return <p>Error {error.message}</p>;

  console.log(data.data[0].company);
  const allInfo = data.data;
  console.log(allInfo);
  return (
    <>
      <div>
        {allInfo.length > 0 &&
          allInfo.map((data) => {
            return (
              <h6 key={data.id}>
                {data.company} {data.Scheme_Name} 
              </h6>
            );
          })}
      </div>
    </>
  );
}

export default App;
