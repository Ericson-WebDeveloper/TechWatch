import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { ProductInterface } from '../models/Product';

export const productApi = createApi({
    reducerPath: 'productApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://127.0.0.1:8000',
    prepareHeaders: (headers, { getState, endpoint }) => {
        headers.set('accept','application/json');
        return headers
      },
      // credentials: 'include',
     }),
    endpoints: (builder) => ({
      getProducts: builder.query<{products: ProductInterface[]}, string>({
        query: (filter) => `/api/products?filter=${filter}`
      }),
    }),
  });

export const { useGetProductsQuery } = productApi;
