import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: `http://localhost:8080/api/` }),
  endpoints: (builder) => ({
    getCompanies: builder.query({
      query: () => "/allInfo",
    }),
  }),
});

export const { useGetCompaniesQuery } = apiSlice;
