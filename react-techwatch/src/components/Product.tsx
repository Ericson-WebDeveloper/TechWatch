import React from 'react'
import { ProductInterface } from '../models/Product'
import { useAppSelector, useAppDispatch } from '../feature/index';
import { ADD_TO_CART, SET_TOTALPRICE, SET_TOTALQTY } from '../feature/cart/cartSlice';

type ProductProps = {
    product: ProductInterface
}

const Product = ({product}: ProductProps) => {
    const {user, token} = useAppSelector(state => state.user);
    const dispatch = useAppDispatch();

    const addCart = () => {
        dispatch(ADD_TO_CART(product));
        dispatch(SET_TOTALQTY());
        dispatch(SET_TOTALPRICE());
    }
  return (
    <div className="flex justify-center">
        <div className="rounded-lg shadow-lg bg-white max-w-sm">
            {/* <a href="#!" data-mdb-ripple="true" data-mdb-ripple-color="light"> */}
                <img className="rounded-t-lg w-[150px] mt-6 mx-auto hover:scale-125" src={`http://127.0.0.1:8000/images/${product.img}`} alt=""/>
            {/* </a> */}
            <div className="p-6">
                <h5 className="text-gray-900 text-xl font-medium mb-2">{product.name}</h5>
                <p className="text-gray-700 text-base mb-4">
                {product.desc.substr(0, 100)}.... </p>
                <p className="text-gray-700 text-base mb-4">
                {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'PHP' }).format(product.price)}</p>
                <button type="button" onClick={addCart} className="inline-block px-6 py-2.5 bg-[#01C17D] text-white font-medium 
                text-xs leading-tight uppercase rounded shadow-md hover:bg-[#11998E] hover:shadow-lg focus:bg-[#11998E]
                focus:shadow-lg focus:outline-none focus:ring-0 active:bg-[#11998E] active:shadow-lg transition duration-150 ease-in-out">
                    Add To Cart</button>
            </div>
        </div>
    </div>
  )
}

export default Product