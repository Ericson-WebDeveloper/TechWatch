import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { updateBillingAddInterface } from '../components/user/BillingForm';
import { updateCredentialInterface } from '../components/user/UserCredentials';
import { updateInfoInterface } from '../components/user/UserInfo';
import { RootState } from '../feature';
import { IGenericResponse } from '../models/Response';
import { cartDetailsInterface, checkoutDetails } from '../pages/CheckOut';
import { paymentDataResponseInterface } from '../pages/paypal/PaymentProcess';


export const paymentApi = createApi({
    reducerPath: 'paymentApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://127.0.0.1:8000',
    prepareHeaders: (headers, { getState, endpoint }) => {
        const token = (getState() as RootState).user.token
        // console.log(endpoint);
        // console.log(token);
        if (token) {
            headers.set('Authorization', `Bearer ${token}`)
        }
        headers.set('accept','application/json');
        return headers
      },
      // credentials: 'include',
     }),
    endpoints: (builder) => ({
      payPaypal: builder.mutation<IGenericResponse, cartDetailsInterface & {details: checkoutDetails}>({
        query(data) {
            return {
                url: '/api/payment-paypal',
                method: 'POST',
                body: data,
              };
        }
      }),
      payPaypalCapture: builder.mutation<IGenericResponse, paymentDataResponseInterface>({
        query(data) {
            return {
                url: '/api/payment-paypal/capture',
                method: 'POST',
                body: data,
              };
        }
      }),
      payPaypalCaptureCancel: builder.mutation<IGenericResponse, {orderId: string}>({
        query(data) {
            return {
                url: '/api/payment-paypal/cancel/order',
                method: 'POST',
                body: data,
              };
        }
      }),
      payStripeCard: builder.mutation<IGenericResponse, cartDetailsInterface & {stripeToken: string} & {details: checkoutDetails}>({
        query(data) {
            return {
                url: '/api/payment-card',
                method: 'POST',
                body: data,
              };
        }
      }),
      payStripeCardCapture: builder.mutation<IGenericResponse, {approvalId: string, order_id: string}>({
        query(data) {
            return {
                url: '/api/payment-card/capture',
                method: 'POST',
                body: data,
              };
        }
      }),
    }),
  });

  export const { usePayPaypalMutation, usePayPaypalCaptureMutation, usePayPaypalCaptureCancelMutation, usePayStripeCardMutation, 
    usePayStripeCardCaptureMutation } = paymentApi;