import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { updateBillingAddInterface } from '../components/user/BillingForm';
import { updateCredentialInterface } from '../components/user/UserCredentials';
import { updateInfoInterface } from '../components/user/UserInfo';
import { RootState } from '../feature';
import { IGenericResponse } from '../models/Response';


export const userApi = createApi({
    reducerPath: 'userApi',
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
      updateInfo: builder.mutation<IGenericResponse, updateInfoInterface>({
        query(data) {
            return {
                url: '/api/user/profile-update',
                method: 'POST',
                body: data,
              };
        }
      }),
      updateCredential: builder.mutation<IGenericResponse, updateCredentialInterface>({
        query(data) {
            return {
                url: '/api/user/password-update',
                method: 'POST',
                body: data,
              };
        }
      }),
      fetchBillingAddr: builder.query<IGenericResponse, void>({
        query: () => `/api/user/billing-address`
      }),
      updateBillingCred: builder.mutation<IGenericResponse, updateBillingAddInterface>({
        query(data) {
            return {
                url: '/api/user/billing-address/update',
                method: 'POST',
                body: data,
              };
        }
      }),
    }),
  });

export const { useUpdateInfoMutation, useUpdateCredentialMutation, useFetchBillingAddrQuery, useUpdateBillingCredMutation } = userApi;