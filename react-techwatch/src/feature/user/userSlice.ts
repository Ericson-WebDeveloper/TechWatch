import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { userInterface } from '../../models/User';
import { getCookie, setCookie, removeCookie } from '../../helper/cookies';
import { BiilingAddInterface } from '../../models/BillingAddress';

// Define a type for the slice state
interface UserState {
    token: string | null;
    user: userInterface | null;
    orders: any | Array<unknown>;
    errors: any | null;
    billing: BiilingAddInterface | null;

}

// Define the initial state using that type
const initialState: UserState = {
  token: getCookie('auth_token') || null,
  user: localStorage.getItem('auth_user') ? JSON.parse(localStorage.getItem('auth_user')!) : null,
  orders: [],
  errors: null,
  billing: null
}

export const userSlice = createSlice({
  name: 'user',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    SET_USER: (state, action:PayloadAction<userInterface | null>) => {
        state.user = action.payload
        localStorage.setItem('auth_user', JSON.stringify(action.payload))
        
    },

    SET_TOKEN: (state, action:PayloadAction<string | null>) => {
        setCookie('auth_token', action.payload!);
        state.token = action.payload
    },

    SET_SIGN_OUT: (state) => {
        state.user = null;
        state.token = null;
        localStorage.removeItem('auth_user');
        removeCookie('auth_token');
    },
    SET_BILLING_ADDR: (state, action: PayloadAction<BiilingAddInterface | null>) => {
      state.billing = action.payload;
    }
  }
})

export const { SET_USER, SET_TOKEN, SET_SIGN_OUT, SET_BILLING_ADDR } = userSlice.actions

export default userSlice.reducer