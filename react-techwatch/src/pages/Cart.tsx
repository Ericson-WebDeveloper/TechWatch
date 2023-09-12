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
