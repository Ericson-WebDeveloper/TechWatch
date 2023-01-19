import moment from 'moment'
import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import '../../assets/css/progress.css'
import Spinner from '../../components/Spinner'
import { useGetOrderQuery } from '../../service/Order'


type OrderTrackingProps = {}

export interface orderTrackInterface {
    amount: number;
    approval_id: string;
    created_at: Date;
    id: number;
    order_status: string;
    payer_id: string;
    payment_type: string;
    qty: number;
    status: number;
    token: string;
    updated_at: Date;
    user_id: number;
}

const OrderTracking = (props: OrderTrackingProps) => {
    const {uuid} = useParams();
    const {data, error, isLoading} = useGetOrderQuery(uuid ? Number(uuid) : 0);

    useEffect(() => {
        if(error) {
            toast.error('Order Not Found!');
        }
    }, [error])

    if(isLoading) {
        return <Spinner />
    }
   
  return (
    <div className='flex w-full h-screen'>
        <div className='flex h-full w-full mx-auto mt-5'>
            <div className="flex flex-col w-full p-6 ">
                <div className='flex flex-col w-full p-2'>
                  {/* v-if="!error" */}
                  <div className="px-4">
                    {
                        data && data?.data 
                        ?
                        <div className="card"> 
                        <div className="flex flex-row justify-between px-3 top">
                            <div className="flex">
                                <h5>ORDER REF#<span className="text-primary font-weight-bold"> {data?.data?.approval_id}</span></h5>
                            </div>
                            {/* <div className="flex flex-col text-sm-right"> */}
                              {/* {if order.order_status == 'shipped'} */}
                                {/* Expected Arrival: {returnArrivalDate(data?.data?.created_at!)} */}
                                {/* <p>USPS <span className="font-weight-bold">234094567242423422898</span></p> */}
                            {/* </div> */}
                        </div>
                        {/* <!-- Add className 'active' to progress --> */}
                        <div className="flex flex-row justify-center">
                            <div className="w-full">
                                <ul id="progressbar" className="text-center">
                                  {/*  className="{'active': order.order_status == 'verified' }" */}
                                    <li className={`step0 ${data?.data?.order_status === 'verified' ? 'active' : ''}`}></li>
                                    {/*  className="{'active': oder.order_status == 'shipped' }" */}
                                    <li className={`step0 ${data?.data?.order_status === 'shipped' ? 'active' : ''}`} ></li>
                                    {/*  className="{'active': order.order_status == 'shipped' }" */}
                                    <li className={`step0 ${data?.data?.order_status === 'shipped' ? 'active' : ''}`} ></li>
                                    {/*  className="{'active': order.order_status == 'delivered' }" */}
                                    <li className={`step0 ${data?.data?.order_status === 'delivered' ? 'active' : ''}`} ></li>
                                </ul>
                            </div>
                        </div>
                        <div className="flex flex-row justify-between top">
                            <div className="flex flex-row icon-content">
                              <img className="icon" src="https://i.imgur.com/9nnc9Et.png" alt='' />
                                <div className="flex flex-column">
                                    <p className="font-weight-bold">Order<br/>Processed</p>
                                </div>
                            </div>
                            <div className="flex flex-row icon-content">
                              <img className="icon" src="https://i.imgur.com/u1AzR7w.png" alt='' />
                                <div className="flex flex-column">
                                    <p className="font-weight-bold">Order<br/>Shipped</p>
                                </div>
                            </div>
                            <div className="flex flex-row icon-content">
                              <img className="icon" src="https://i.imgur.com/TkPm63y.png" alt='' />
                                <div className="flex flex-column">
                                    <p className="font-weight-bold">Order<br/>On The Way</p>
                                </div>
                            </div>
                            <div className="flex flex-row icon-content">
                              <img className="icon" src="https://i.imgur.com/HdsziHP.png" alt='' />
                                <div className="flex flex-column">
                                    <p className="font-weight-bold">Order <br/> Arrived</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    :
                    <div >
                        <div className="card">
                            <div className="row flex justify-center px-3 top">
                                <div className="flex">
                                    <h5>ORDER NOT FOUND</h5>
                                </div>
                            </div> 
                            {/* <!-- Add className 'active' to progress --> */}
                        </div>
                    </div>
                    }
                    
                    
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default OrderTracking