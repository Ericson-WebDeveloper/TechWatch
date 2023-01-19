import React from 'react'


type OrderSummaryProps = {
    data : {
        Delivered: number;
        toPack: number;
        toShipped: number;
        total: number;
    }
}

const OrderSummary = ({data}: OrderSummaryProps) => {
    
  return (
    <>
        <div className='flex flex-col md:flex-row justify-between'>
            <div className="form-group mb-6">
                <label className="form-label inline-block mb-2 text-gray-700">Total Order</label>
                <span> {data.total} </span>
            </div>
            <div className="form-group mb-6">
                <label className="form-label inline-block mb-2 text-gray-700">To Shipped</label>
                <span> {data.toPack}</span>
            </div>
            <div className="form-group mb-6">
                <label className="form-label inline-block mb-2 text-gray-700">Delivered</label>
                <span> {data.Delivered}</span>
            </div>
        </div>
        <div className='flex flex-col md:flex-row justify-between'>
            <div className="form-group mb-6">
                <label className="form-label inline-block mb-2 text-gray-700">Return's</label>
                <span> 0</span>
            </div>
            <div className="form-group mb-6">
                <label className="form-label inline-block mb-2 text-gray-700">Cancellation's</label>
                <span> 0</span>
            </div>
            <div className="form-group mb-6">
                {/* <label className="form-label inline-block mb-2 text-gray-700">Cancellation's</label>
                <span>0</span> */}
            </div>
        </div>
    </>
  )
}

export default OrderSummary