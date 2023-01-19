import React from 'react'
import Spinner from '../../components/Spinner';
import OrderItem from '../../components/user/OrderItem'
import { useGetOrdersQuery } from '../../service/Order';
import { OrderInterface } from '../../models/Order';

type OrdersProps = {}

const Orders = (props: OrdersProps) => {
    const {data, error, isLoading} = useGetOrdersQuery();

    if(isLoading) {
        return <Spinner />
    }
  return (
    <div className='flex w-full h-auto'>
        <div className='flex h-auto w-full mx-auto mt-5'>
            <div className="flex flex-col lg:flex-row w-full p-6 ">
                <div className='flex flex-col w-full lg:flex-row p-2'>
                    <div className="flex flex-col w-full space-y-2">
                        {
                            data?.data?.map((order:OrderInterface, index: number) => {
                                return  <OrderItem key={index} order={order} />
                            })
                        }               
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Orders