import React from 'react'
import { Link } from 'react-router-dom'
import { userInterface } from '../../models/User';

type SideNavProps = {
  user: userInterface | null;
}

const SideNav = ({user}: SideNavProps) => {
  return (
    <>
         <img src="https://img.icons8.com/bubbles/100/000000/user.png"  width="80" alt="" />
        <h1 className='text-xl font-semibold text-blue-500'>{user?.name}</h1>
        <br />
        <div className="flex w-[70%] justify-center">
            <ul className="bg-white rounded-lg border border-gray-200 w-96 text-gray-900">
            <Link to="/user/profile">
              <li className="px-6 py-2 border-b border-gray-200 rounded-t-lg">Profile</li>
            </Link>
            
            <Link to="/user/profile-billing/address">
                <li className="px-6 py-2 border-b border-gray-200 ">Billing Address</li>
            </Link>
            <Link to="/user/orders">
              <li className="px-6 py-2 border-b border-gray-200 ">Order's</li>
            </Link>
            </ul>
        </div>
    </>
  )
}

export default SideNav