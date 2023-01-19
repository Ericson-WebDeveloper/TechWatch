import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { IGenericResponse } from '../models/Response';
import { RootState } from '../feature/index';
import { orderTrackInterface } from '../pages/user/OrderTracking';

export const orderApi = createApi({
    reducerPath: 'orderApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://127.0.0.1:8000',
    prepareHeaders: (headers, { getState, endpoint }) => {
        const token = (getState() as RootState).user.token
        // console.log(endpoint);
        // console.log(token);
        if (token) {
            headers.set('Authorization', `Bearer ${token}`)
        }
          headers.set('accept','application/json');
          return headers;
      },
        // credentials: 'include',
     }),
    endpoints: (builder) => ({
      getOrderAfterPayment: builder.mutation<IGenericResponse, {order_id: string, paymentId: string, payerId?: string}>({
        query(data) {
            return {
                url: '/api/payment-paypal/fetch',
                method: 'POST',
                body: data
              };
        }
      }),
      getOrder: builder.query<{data: orderTrackInterface}, number>({
        query: (id) =>  `/api/user/order/track-package/${id}`
      }),
      getOrders: builder.query<IGenericResponse, void>({
        query: () =>  `/api/user/orders`
      }),
      getOrderItem: builder.query<IGenericResponse, number>({
        query: (id) =>  `/api/user/order/item/${id}`
      }),
      getOrdersSummary: builder.query<IGenericResponse, void>({
        query: () =>  `/api/user/orders/summary`
      }),
    }),
  });

export const { useGetOrderAfterPaymentMutation, useGetOrderQuery, useGetOrdersQuery, useGetOrderItemQuery, useGetOrdersSummaryQuery } = orderApi;