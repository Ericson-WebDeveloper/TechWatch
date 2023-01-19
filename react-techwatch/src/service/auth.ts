import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../feature';
// import { ProductInterface } from '../models/Product';
import { IGenericResponse } from '../models/Response';
import { IResetPass } from '../pages/ResetPass';
import { SigInInterface } from '../pages/SignIn';
import { socialInterface } from '../pages/SignInCallBack';
import { SignUpInterface } from '../pages/SignUp';

export const authApi = createApi({
    reducerPath: 'authApi',
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
      loginUser: builder.mutation<IGenericResponse, SigInInterface>({
        query(data) {
            return {
              url: '/api/user/login',
              method: 'POST',
              body: data,
            };
          },
      }),
      loginSocial: builder.mutation<IGenericResponse, socialInterface>({
        query(data) {
            return {
              url: '/api/user/login/social/callback',
              method: 'POST',
              body: data,
            };
          },
      }),
      loginUserSocial: builder.mutation<{message: string, link: string}, string>({
        query(provider) {
            return {
              url: `/api/user/${provider}/login`,
              method: 'POST',
            };
          },
      }),
      logoutUser: builder.mutation<IGenericResponse, void>({
        query() {
            return {
              url: '/api/user/logout',
              method: 'POST',
            };
          },
      }),
      registerUser: builder.mutation<IGenericResponse, SignUpInterface>({
        query(data) {
            return {
              url: '/api/user/register',
              method: 'POST',
              headers: {
                // 'content-type': 'application/json'
              },
              body: data,
            };
          },
      }),

      forgotPass: builder.mutation<IGenericResponse, {email: string}>({
        query(data) {
            return {
              url: '/api/user/forgot-password',
              method: 'POST',
              headers: {
                // 'content-type': 'application/json'
              },
              body: data,
            };
          },
      }),
      resetPass: builder.mutation<IGenericResponse, IResetPass>({
        query(data) {
            return {
              url: '/api/user/reset-password',
              method: 'POST',
              headers: {
                // 'content-type': 'application/json'
              },
              body: data,
            };
          },
      })
    }),
  });

export const { useLoginUserMutation, useLogoutUserMutation, useRegisterUserMutation, useLoginUserSocialMutation, useLoginSocialMutation, 
useForgotPassMutation, useResetPassMutation } = authApi;