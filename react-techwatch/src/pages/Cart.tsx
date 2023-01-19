import React from 'react'
import { Link } from 'react-router-dom'
import CartItem from '../components/user/CartItem';
import { useAppSelector } from '../feature';

type CartProps = {}

const Cart = (props: CartProps) => {
	const {cart, totalQty, totalPrice} = useAppSelector(state => state.cart);
  return (
    <div className='flex w-full h-screen'>
      <div className='flex flex-row h-full w-full'>
      	<div className="w-[50%] md:w-[60%] lg:w-[100%] py-12 mx-auto">
		
			<div className="w-full mx-auto bg-gray-100 shadow-lg rounded-lg  md:max-w-5xl">
				<div className="md:flex">
					<div className="w-full p-4 px-5 py-5">
						<div className="flex w-full">
						{/* <div className="md:grid md:grid-cols-3 gap-2 "> */}

							<div className="col-span-2 w-full p-5">
								<h1 className="text-xl font-medium ">TechWatch - Shopping Cart</h1>

									{
										cart 
										?
										cart?.map((crt, index) => {
											return <CartItem key={index} cartitem={crt} />
										})
										:
										null
									}
									

									<div className="flex justify-between items-center mt-6 pt-6 border-t"> 
										<div className="flex items-center">
											<i className="fa fa-arrow-left text-sm pr-2"></i>
											<Link to='/' className="text-md font-medium text-[#01C17D] hover:text-[#11998E]">Continue Shopping</Link>
										</div>

										<div className="flex justify-center items-end">
											<span className="text-sm font-medium text-gray-400 mr-1">Subtotal:</span>
											<span className="text-lg font-bold text-gray-800 ">
												{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'PHP' }).format(totalPrice)}</span>				
										</div>
									</div>

								<br />
								{
									cart 
									?
									<Link to='/checkout-shop'>
										<button className="h-12 w-full bg-[#01C17D] rounded focus:outline-none text-white 
										hover:bg-[#11998E]">Check Out</button>
									</Link>
									:
									null
								}
								
							</div>
            		{/* <div className=" p-5 bg-gray-800 rounded overflow-visible">

            			<span className="text-xl font-medium text-gray-100 block pb-3">Card Details</span>

            			<span className="text-xs text-gray-400 ">Card Type</span>

            			<div className="overflow-visible flex justify-between items-center mt-2">

            				<div className="rounded w-52 h-28 bg-gray-500 py-2 px-4 relative right-10">

            					<span className="italic text-lg font-medium text-gray-200 underline">VISA</span>

            					<div className="flex justify-between items-center pt-4 ">
            						
            						<span className="text-xs text-gray-200 font-medium">****</span>
            						<span className="text-xs text-gray-200 font-medium">****</span>
            						<span className="text-xs text-gray-200 font-medium">****</span>
            						<span className="text-xs text-gray-200 font-medium">****</span>

            					</div>

            					<div className="flex justify-between items-center mt-3">
             						
            						<span className="text-xs  text-gray-200">Giga Tamarashvili</span>
            						<span className="text-xs  text-gray-200">12/18</span>
            					</div>

            					
            				</div>


            				<div className="flex justify-center  items-center flex-col">

            					<img src="https://img.icons8.com/color/96/000000/mastercard-logo.png" width="40" className="relative right-5" />
            					<span className="text-xs font-medium text-gray-200 bottom-2 relative right-5">mastercard.</span>
            					
            				</div>
            				
            			</div>




            			<div className="flex justify-center flex-col pt-3">
            				<label className="text-xs text-gray-400 ">Name on Card</label>
            				<input type="text" className="focus:outline-none w-full h-6 bg-gray-800 text-white placeholder-gray-300 text-sm 
                    border-b border-gray-600 py-4" placeholder="Giga Tamarashvili"/>
            			</div>

            			<div className="flex justify-center flex-col pt-3">
            				<label className="text-xs text-gray-400 ">Card Number</label>
            				<input type="text" className="focus:outline-none w-full h-6 bg-gray-800 text-white placeholder-gray-300 
                    text-sm border-b border-gray-600 py-4" placeholder="****     ****      ****      ****"/>
            			</div>

            			<div className="grid grid-cols-3 gap-2 pt-2 mb-3">

            				<div className="col-span-2 ">

            					<label className="text-xs text-gray-400">Expiration Date</label>
            					<div className="grid grid-cols-2 gap-2">

            						<input type="text" className="focus:outline-none w-full h-6 bg-gray-800 text-white
                         placeholder-gray-300 text-sm border-b border-gray-600 py-4" placeholder="mm"/>
            						<input type="text" className="focus:outline-none w-full h-6 bg-gray-800 text-white
                         placeholder-gray-300 text-sm border-b border-gray-600 py-4" placeholder="yyyy"/>
            						
            					</div>
            					
            				</div>

            				<div className="">
            					<label className="text-xs text-gray-400">CVV</label>
            					<input type="text" className="focus:outline-none w-full h-6 bg-gray-800 text-white
                       placeholder-gray-300 text-sm border-b border-gray-600 py-4" placeholder="XXX"/>
            					
            				</div>
            				
            			</div>

            			<button className="h-12 w-full bg-blue-500 rounded focus:outline-none text-white hover:bg-blue-600">Check Out</button>
    			
            		</div> */}
            				</div>
           				</div>
        			</div>
    			</div>
    		</div>
      	</div>
    </div> 
  )
}

export default Cart