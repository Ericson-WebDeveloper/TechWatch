import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux'
import type { TypedUseSelectorHook } from 'react-redux'
import { productApi } from '../service/products';
import { setupListeners } from '@reduxjs/toolkit/query'
import { authApi } from '../service/auth';
import useReducer from './user/userSlice';
import cartReducer from './cart/cartSlice'
import { userApi } from '../service/User';
import { paymentApi } from '../service/Payment';
import { orderApi } from '../service/Order';

export const store = configureStore({
  reducer: {
    user: useReducer,
    cart: cartReducer,
     // Add the generated reducer as a specific top-level slice
     [productApi.reducerPath]: productApi.reducer,
     [authApi.reducerPath]: authApi.reducer,
     [userApi.reducerPath]: userApi.reducer,
     [paymentApi.reducerPath]: paymentApi.reducer,
     [orderApi.reducerPath]: orderApi.reducer
  },
  // Adding the api middleware enables caching, invalidation, polling,
  // and other useful features of `rtk-query`.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([productApi.middleware, authApi.middleware, userApi.middleware, 
      paymentApi.middleware, orderApi.middleware]),
});

setupListeners(store.dispatch)

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch


// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector