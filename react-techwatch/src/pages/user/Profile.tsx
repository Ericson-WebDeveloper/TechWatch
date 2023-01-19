import React from 'react'
import Spinner from '../../components/Spinner'
import OrderSummary from '../../components/user/OrderSummary'
import SideNav from '../../components/user/SideNav'
import UserCredentials from '../../components/user/UserCredentials'
import UserInfo from '../../components/user/UserInfo'
import { useAppSelector } from '../../feature'
import { useGetOrdersSummaryQuery } from '../../service/Order'

type ProfileProps = {}

const Profile = (props: ProfileProps) => {
  const {user} = useAppSelector(state => state.user);
  const {data, isLoading, isError, error} = useGetOrdersSummaryQuery();

  if(isLoading) {
    return <Spinner />

  }
  console.log(data);
  return (
    <div className='flex w-full h-auto lg:h-screen'>
        <div className='flex h-full lg:h-[600px] w-[80%] mx-auto mt-5'>
            <div className="flex flex-col lg:flex-row w-full p-6 bg-white rounded-2xl">
                <div className='flex flex-col w-[40%] h-full'>
                  <div className='flex flex-col w-full justify-center items-center'>
                   <SideNav user={user} />
                  </div>
                </div>
                <div className='flex flex-col w-full h-full'>
                  <div className='flex flex-col w-full'>
                    <h1 className='text-2xl font-semibold font-serif'>Profile Info</h1>
                    <hr />
                    <br />
                      <UserInfo user={user} />
                  </div>
                  <br />
                  <div className='flex flex-col w-full h-full'>
                    <div className='flex flex-col w-full'>
                      <h1 className='text-2xl font-semibold font-serif'>User Credentials</h1>
                      <hr />
                      <br />
                        <UserCredentials />
                    </div>
                  </div>
                  <br />
                  <div className='flex flex-col w-full h-full'>
                    <div className='flex flex-col w-full'>
                      <h1 className='text-2xl font-semibold font-serif'>User Order Summary</h1>
                      <hr />
                      <br />
                        <OrderSummary data={data?.data} />
                    </div>
                  </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Profile