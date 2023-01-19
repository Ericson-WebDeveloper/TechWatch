import React from 'react'
import { Link } from 'react-router-dom'
import { OrderInterface } from '../../models/Order'

type OrderItemProps = {
    order: OrderInterface
}

function OrderItem({order}: OrderItemProps) {
  return (
    <>
        <div className="w-full p-6 rounded-lg shadow-lg bg-white space-y-2">
            
            <div className='flex p-3 bg-[rgb(1,192,125)] rounded-2xl items-center mb-2'>
                <h5 className="text-white text-xl leading-tight font-medium mb-2 mr-2">
                { order.status === 1 ? 'Paid' : 'Not Paid' } - October 26th 2022, 9:20:27 am</h5>
                <Link to={`/user/order/${order.id}`}>
                    <button type="button" className="w-full px-6 py-2.5 bg-[#11998E] text-white font-medium text-xs leading-tight uppercase rounded shadow-md
                    hover:bg-[rgb(1,192,125)]hover:shadow-lg
                    focus:bg-[rgb(1,192,125)] focus:shadow-lg focus:outline-none focus:ring-0
                    active:bg-[rgb(1,192,125)] active:shadow-lg transition duration-150 ease-in-out">View</button>
                </Link>
            </div>
            {
                order?.order_item?.items?.map((item, index: number) => {
                    return  <div className='flex flex-col md:flex-row justify-between items-center' key={index}>
                                <div className='jusify-center items-center'>
                                    <img src={`http://127.0.0.1:8000/images/${item.img}`} className='w-[100px]' alt="" />
                                </div>
                                <div className='jusify-center items-center'>
                                    <p>{ item.name }</p>
                                </div>
                                <div className='jusify-center items-center'>
                                    <p>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'PHP' }).format(item.price)}</p>
                                </div>
                                <div className='jusify-center items-center'>
                                    <p>Qty: { item.qty }</p>
                                </div>
                        
                                <div className='jusify-center items-center'>
                                
                                {/* <Link to={`/user/order-tracking/${1}`}>
                                <button type="button" className="w-full px-6 py-2.5 bg-blue-600
                                    text-white font-medium text-xs leading-tight uppercase rounded shadow-md
                                    hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0
                                    active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out">Tracking</button></Link> */}
                                </div>
                            </div>
                })
            }
           
            
            {/* <button type="button" className=" inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out">Button</button> */}
        </div>
    </>
  )
}

export default OrderItem