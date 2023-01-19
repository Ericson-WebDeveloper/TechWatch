import React, { useEffect, useRef, useState } from 'react'
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Spinner from '../../components/Spinner';
import { useGetOrderAfterPaymentMutation } from '../../service/Order';

type PaymentDoneProps = {}

const PaymentDone = (props: PaymentDoneProps) => {
  let { status } = useParams();
  const shoudlRun = useRef(true);
  const [orderDetails, setOrderDetails] = useState<any | null>(null);
  let [queryParams, setQueryParams] = useSearchParams();
  const [getOrderAfterPayment, {isLoading: loadingFetchOrder}] = useGetOrderAfterPaymentMutation();
  const navigate = useNavigate();
  const getOrderSummary = async () => {
    try {
      if(!status || !queryParams.get('orderId') || !queryParams.get('paymentId') || 
      !queryParams.get('PayerID') || !queryParams.get('token')) {
        toast.error('You dont have pay to process')
        return false;
      }
      const data = {
        // status,
        order_id: queryParams.get('orderId') ||  '',
        paymentId: queryParams.get('paymentId') || '',
        payerId: queryParams.get('PayerID') || ''
      }
      let response: any = await getOrderAfterPayment(data).unwrap();
      setOrderDetails(response.data?.order);
    } catch (error) {
      console.log(error);
      toast.error('Fetching Order Summary Failed');
    }
  }

  useEffect(() => {
    if(shoudlRun.current) {
      shoudlRun.current = false;
      getOrderSummary();
    }
  }, []);

  if(loadingFetchOrder) {
    return <Spinner/>
  }
  return (
    <div className='flex w-full h-screen'>
        <div className='flex h-full lg:h-[600px] w-full mx-auto mt-5'>
          {
            orderDetails
            ?
            <div className="flex flex-col w-full p-6">
                <div className='flex p-4 rounded-lg w-full justify-center items-center bg-gray-300'>
                  <h1 className='text-4xl font-serif font-semibold'>{status ? 'Success' : 'Failed'}</h1>
                </div>
                <br />
                <div className='flex flex-col p-4 rounded-lg w-full bg-gray-300'>
                  <h1 className='text-2xl font-serif font-semibold'>Customer Name: {orderDetails?.order_item?.details.name}</h1>
                  <br /><br />
                  <h1 className='text-2xl font-serif font-semibold'>Thank you for Order</h1>
                  <h1 className='text-xl font-serif font-semibold'>Payment Order Ref: {orderDetails?.approval_id}</h1>
                  <br /><br />
                  <h1 className='text-xg font-serif font-semibold'>Payment Summary</h1>
                  {/* Loop Items */}
                  {
                    orderDetails?.order_item?.items?.map((item: any, index: number) => {
                      return <div className='flex flex-col lg:flex-row' key={index}>
                                <div className='flex-none w-[65%]'>
                                <b><p className='text-lg font-serif font-semibold'>{item.name } (Qty: { item.qty })</p></b>
                                </div>
                                <div className='flex-none w-[65%] w-b'>
                                  Php { item.price }
                                </div>
                              </div>
                    })
                  }
                  

                  <br /><br />
                  <div className='flex flex-col lg:flex-row'>
                    <div className='flex-none w-[65%]'>
                     <b><p className='text-lg font-serif font-semibold'>Shipping Fee</p></b>
                    </div>
                    <div className='flex-none w-[65%] w-b'>
                    <small>Php 00.00</small>
                    </div>
                  </div>

                  <div className='flex flex-col lg:flex-row'>
                    <div className='flex-none w-[65%]'>
                     <b><p className='text-lg font-serif font-semibold'>Tax Fee</p></b>
                    </div>
                    <div className='flex-none w-[65%] w-b'>
                      <small>Php 00.00</small>
                    </div>
                  </div>

                  <br /><br />

                  <div className='flex flex-col lg:flex-row'>
                    <div className='flex-none w-[65%]'>
                     <b><p className='text-lg font-serif font-semibold'>Total</p></b>
                    </div>
                    <div className='flex-none w-[65%] w-b'>
                    Php { orderDetails?.amount }
                    </div>
                  </div>
                    <br />
                    {
                      orderDetails
                      ?
                      <button type='button' onClick={() => navigate(`/user/order-tracking/${orderDetails?.id}`)} className='w-[150px] mx-auto px-6 py-2.5 bg-[#01C17D] text-white font-medium text-xs leading-tight uppercase rounded
                      shadow-md hover:bg-[#11998E] hover:shadow-lg focus:bg-[#11998E] focus:shadow-lg focus:outline-none focus:ring-0
                      active:bg-[#11998E] active:shadow-lg transition duration-150 ease-in-outt'>Track Order</button>
                        
                        :
                        null
                    }
                  {/* <button className='w-[150px] mx-auto px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded
                        shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0
                        active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out'>Track Page</button> */}
                </div>
            </div>
            :
            null
          }
            
        </div>
    </div>
  )
}

export default PaymentDone