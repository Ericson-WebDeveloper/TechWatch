import React from 'react'
import { cartinterface } from '../../models/Cart'
import { useAppDispatch } from '../../feature/index';
import { INCREMENT_CART, REDUCE_CART, REMOVE_CART } from '../../feature/cart/cartSlice';

type CartItemProps = {
    cartitem: cartinterface
}

const CartItem = ({cartitem}: CartItemProps) => {
    const dispatch = useAppDispatch();

    const removeItemCart = (uuid: string) => {
        dispatch(REMOVE_CART(uuid));
    }

    const reduceQtyCart = (uuid: string) => {
        dispatch(REDUCE_CART(uuid))
    }

    const incrementCartItem = (uuid: string) => {
        dispatch(INCREMENT_CART(uuid))
    }

  return (
    <div className="flex justify-between items-center mt-6 pt-6">
        <div className="flex items-center">
            <img src={`http://127.0.0.1:8000/images/${cartitem.img}`} width="60" className="rounded-full" alt=''/>
            <div className="flex flex-col ml-3">
                <span className="md:text-md font-medium">{cartitem.name}</span>
                {/* <span className="text-xs font-light text-gray-400">#41551</span> */}
            </div>
        </div>

        <div className="flex justify-center items-center">
            <div className="pr-8 flex">
                <span className="font-semibold cursor-pointer border-2 px-1 hover:bg-gray-200" onClick={() => reduceQtyCart(cartitem.uuid)}>-</span>
                <input type="text" readOnly className=" focus:outline-none bg-gray-100 border h-6 w-8 rounded text-sm px-2 mx-2" value={cartitem.qty} />
                <span className="font-semibold cursor-pointer border-2 px-1 hover:bg-gray-200"onClick={() => incrementCartItem(cartitem.uuid)} >+</span>
            </div>
            <div className="pr-8 ">
                <span className="text-xs font-medium">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'PHP' }).format(cartitem.price)}</span>
            </div>
            <div>
                <i className="text-red-400 fa fa-close text-xs font-medium cursor-pointer border-2 px-1 hover:bg-gray-200"
                onClick={() => removeItemCart(cartitem.uuid)}></i>
            </div>
        </div>
    </div>
  )
}

export default CartItem