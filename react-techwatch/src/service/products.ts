import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { ProductInterface } from '../models/Product';
import { configEnv } from '../helper/config';

export const productApi = createApi({
    reducerPath: 'productApi',
    baseQuery: fetchBaseQuery({ baseUrl: configEnv.api_url,
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
