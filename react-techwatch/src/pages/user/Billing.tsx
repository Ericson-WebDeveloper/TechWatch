import React, { useEffect } from 'react'
import Spinner from '../../components/Spinner'
import BillingForm from '../../components/user/BillingForm'
import SideNav from '../../components/user/SideNav'
import { useAppSelector } from '../../feature'
import { SET_BILLING_ADDR } from '../../feature/user/userSlice'
import { useFetchBillingAddrQuery } from '../../service/User'
import { useAppDispatch } from '../../feature/index';

type Props = {}

const Billing = (props: Props) => {
  const {user, billing} = useAppSelector(state => state.user);
  const dispatch = useAppDispatch();
  const { data, error, isLoading: fetchBiilingLoading, isError, isSuccess } = useFetchBillingAddrQuery();

  useEffect(() => {
    if(isError) {
        dispatch(SET_BILLING_ADDR(null));
    }
    if(isSuccess) {
      const response: any = data.data;
      if(response.billing) dispatch(SET_BILLING_ADDR(response.billing));
    }
  }, [isSuccess, data, isError, dispatch])

  if(fetchBiilingLoading) {
    return <Spinner />
  }

  return (
    <div className='flex w-full h-auto lg:h-screen'>
        <div className='flex h-full lg:h-[600px] w-[80%] mx-auto mt-5'>
            <div className="flex flex-col lg:flex-row w-full p-6 bg-white rounded-3xl">
                <div className='flex flex-col w-[40%] h-full'>
                  <div className='flex flex-col w-full justify-center items-center'>
                   <SideNav user={user} />
                  </div>
                </div>
                <div className='flex flex-col w-full h-full'>
                  <div className='flex flex-col w-full'>
                    <h1>Profile Billing Address</h1>
                    <hr />
                    <br />
                      <BillingForm billing={billing} />
                      
                  </div>

                </div>
            </div>
        </div>
    </div>
  )
}

export default Billing