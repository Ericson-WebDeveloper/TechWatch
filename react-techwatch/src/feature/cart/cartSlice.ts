import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { cartinterface } from '../../models/Cart'
import { ProductInterface } from '../../models/Product';
import { v4 as uuidv4 } from 'uuid';


// Define a type for the slice state
interface CartState {
    cart: cartinterface[] | null,
    wishlist: cartinterface[] | null,
    totalPrice: number,
    totalQty: number

}

// Define the initial state using that type
const initialState: CartState = {
    cart: localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')!) : null,
    wishlist: localStorage.getItem('wishlist') ? JSON.parse(localStorage.getItem('wishlist')!) : null,
    totalPrice: 0,
    totalQty: 0
}

export const cartSlice = createSlice({
  name: 'cart',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    ADD_TO_CART: (state, action: PayloadAction<ProductInterface>) => {
        let data = {
            uuid: uuidv4(),
            id: action.payload.id,
            name: action.payload.name,
            price: Number(action.payload.price),
            totalprice: Number(action.payload.price) * 1,
            img: action.payload.img,
            qty: 1
       }
       if(state.cart) {
        console.log('here');
            let index = Array.from(state.cart!).findIndex(cart => cart.id === data.id) as number;
            console.log(index);
            if(index !== -1) {
                state.cart![index].qty = state.cart![index].qty + data.qty
                // state.cart[index].price = state.cart[index].price * state.cart[index].qty
                state.cart![index].totalprice = state.cart![index].price * state.cart![index].qty
                let newCart = state.cart
                state.cart = newCart
            } else {
                state.cart!.push(data)
            }

        } else {
            state.cart = []
            state.cart!.push(data)
        }
        localStorage.setItem('cart', JSON.stringify(state.cart))
    },
    SET_TOTALPRICE: (state) => {
        if(state.cart && state.cart.length > 0) {
            state.totalPrice = Array.from(state.cart!)?.map((cart) => {
                return cart.totalprice;
            }).reduce((a,b) => {
                return Number(a) + Number(b)
            });
        } else {
            state.totalPrice = 0
        }
    },
    RESTART_CART: (state) => {
        state.cart = null;
        localStorage.removeItem('cart')
    },

    SET_TOTALQTY: (state) => {
        if(state.cart && state.cart.length > 0) {
            state.totalQty = Array.from(state.cart!)?.map((cart) => {
                return cart.qty;
            }).reduce((a,b) => {
                return Number(a) + Number(b)
            });
        } else {
            state.totalQty = 0
        }
    },


    REDUCE_CART: (state, action: PayloadAction<string>) =>  {
        let index = Array.from(state.cart!).findIndex(cart => cart.uuid === action.payload);
            if(index !== -1) {
                if(state.cart![index].qty === 1) {
                    state.cart!.splice(index, 1)
                } else {
                    state.cart![index].qty--
                    // state.cart[index].price = state.cart[index].price * state.cart[index].qty
                    state.cart![index].totalprice = state.cart![index].price * state.cart![index].qty
                    let newCart = state.cart
                    state.cart = newCart!?.length > 0 ? newCart : null
                }
                if(state.cart) localStorage.setItem('cart', JSON.stringify(state.cart)) 
            }    
    },

    REMOVE_CART: (state, action: PayloadAction<string>) =>  {
        if(state.cart) {
            state.cart = Array.from(state.cart!).filter(cart => cart.uuid !== action.payload)
        }  
    },

    INCREMENT_CART: (state, action: PayloadAction<string>) => {
        let index = Array.from(state.cart!).findIndex(cart => cart.uuid === action.payload);
            if(index !== -1) {
                if(state.cart![index].qty < 3) {
                    state.cart![index].qty++
                    // state.cart[index].price = state.cart[index].price * state.cart[index].qty
                    state.cart![index].totalprice = state.cart![index].price * state.cart![index].qty
                    let newCart = state.cart
                    state.cart = newCart
                }
                localStorage.setItem('cart', JSON.stringify(state.cart))
            }    

    }

  }
})

export const { ADD_TO_CART, SET_TOTALPRICE, RESTART_CART, SET_TOTALQTY, REDUCE_CART, INCREMENT_CART, REMOVE_CART } = cartSlice.actions

export default cartSlice.reducer