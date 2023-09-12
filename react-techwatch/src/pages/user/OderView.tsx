import React, {useMemo} from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom';
import Spinner from '../../components/Spinner'
import { useGetOrderItemQuery } from '../../service/Order'
import moment from 'moment'

type OderViewProps = {
    children?: JSX.Element
}

export interface itemOrder {
    id: number;
    img: string;
    name: string;
    price: number;
    qty: number;
    totalprice: number;
    uuid: string;
}

const OderView = ({children}: OderViewProps) => {
    const {uuid} = useParams();
    const {data, isLoading, isError, error} = useGetOrderItemQuery(uuid ? Number(uuid) : 0);
    const navigate = useNavigate();
    if(isLoading) {
        return <Spinner/>
    }
    
    const computeTotal = () => {
        return data?.data?.items.reduce((total: number, num: itemOrder) => {
                return total + num.totalprice;
        }, 0)
    }
  return (
    <div className='flex w-full h-screen'>
    <div className='flex h-full lg:h-[600px] w-full mx-auto mt-5'>
        <div className="flex flex-col lg:flex-row w-full p-6 ">
            <div className='flex flex-col w-full lg:flex-row p-2'>
                <div className="flex flex-col w-full space-y-2">
                    <div className="w-full p-6 rounded-2xl shadow-lg bg-white space-y-2">
                        <div className='flex p-3 bg-[rgb(1,192,125)] rounded-xl space-x-4 justify-center items-center'>
                         
                            <h3 className="text-gray-900 text-xl leading-tight font-medium mb-2 ">
                               { data?.data?.order?.status === 1 ?
                               `Paid - ${moment(data?.data?.order?.created_at).add(7, 'days').format('MMMM Do YYYY, h:mm:ss a')} | Standard Delivery` : 
                               `Not Paid - ${moment(data?.data?.order?.created_at).add(7, 'days').format('MMMM Do YYYY, h:mm:ss a')}` }  </h3>
                           
                            {
                                data?.data?.order?.status === 1
                                ?
                                <button type='button' onClick={() =>  navigate(`/user/order-tracking/${data?.data?.order?.id}`)} 
                                className="px-6 py-2.5 bg-green-600
                                text-white font-medium text-xs leading-tight uppercase rounded shadow-md
                                hover:bg-green-700 hover:shadow-lg focus:bg-green-700 focus:shadow-lg focus:outline-none focus:ring-0
                                active:bg-green-800 active:shadow-lg transition duration-150 ease-in-out">Track Order</button>
                                :
                                null
                            }
                            
                   
                        </div>
                        {
                            data?.data?.items?.map((item: itemOrder, index:number) => {
                                return  <div className='flex flex-row justify-between items-center border p-2 rounded-3xl' key={index}>
                                            <div className='jusify-center items-center'>
                                                <img src={`http://127.0.0.1:8000/images/${item.img}`} className='w-[100px]' alt="" />
                                            </div>
                                            <div className='jusify-center items-center'>
                                                <p>{item.name}</p>
                                            </div>
                                            <div className='jusify-center items-center'>
                                                <p>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'PHP' }).format(item.price)}</p>
                                            </div>
                                            <div className='jusify-center items-center'>
                                                <p>{item.qty}</p>
                                            </div>
                                            <div className='jusify-center items-center'>
                         
                                            </div>
                                        </div>  
                            })
                        }
                         

                    </div>

                    <div className="w-full p-6 shadow-lg bg-white space-y-2 rounded-2xl">
                        <div className='flex p-3  rounded-lg'>
                            <h3 className="text-gray-900 text-xl leading-tight font-medium mb-2 ">
                                <b>Order No: {data?.data?.order?.approval_id}</b></h3>
                        </div>                       
                    </div>

                    <div className="w-full p-6 rounded-2xl shadow-lg bg-white space-y-2">
                        <div className='flex flex-col p-3 space-y-4'>
                            <h3 className="text-gray-900 text-xl leading-tight font-medium mb-2 ">
                            <b>Total Summary</b></h3>
                            <div className='flex flex-col md:flex-row justify-between'>
                                <h3 className="text-gray-900 text-xl leading-tight font-medium mb-2 ">
                            <b>SubTotal(qty)</b></h3>
                                <h3 className="text-gray-900 text-xl leading-tight font-medium mb-2 ">
                                {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'PHP' }).format(computeTotal())}</h3>
                            </div>
                            <div className='flex flex-col md:flex-row justify-between'>
                                <h3 className="text-gray-900 text-xl leading-tight font-medium mb-2 ">
                            <b>Shipping Fee</b></h3>
                                <h3 className="text-gray-900 text-xl leading-tight font-medium mb-2 ">
                                Php 0.00</h3>
                            </div>
                            <hr className='text-black text-xl divide-green-100' />
                            <div className='flex flex-col md:flex-row justify-between'>
                                <h3 className="text-gray-900 text-xl leading-tight font-medium mb-2 ">
                                <b>Total (Vat incl.)</b></h3>
                                <h3 className="text-gray-900 text-xl leading-tight font-medium mb-2 ">
                                Php 0.00</h3>
                            </div>
                            <div className='flex flex-col md:flex-row justify-between'>
                                <h3 className="text-gray-900 text-xl leading-tight font-medium mb-2 ">
                                Paid by {data?.data?.order?.payment_type}</h3>
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

export default OderView
