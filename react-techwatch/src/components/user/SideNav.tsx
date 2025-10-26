import React from 'react'
import { Link } from 'react-router-dom'
import { userInterface } from '../../models/User';

type SideNavProps = {
  user: userInterface | null;
}

const links = [
  {
    label: "Profile", link: "/user/profile"
  },
  {
    label: "Billing Address", link: "/user/profile-billing/address"
  },
  {
    label: "Order's", link: "/user/orders"
  },
]

const SideNav = ({ user }: SideNavProps) => {
  return (
    <>
      <img src="https://img.icons8.com/bubbles/100/000000/user.png" width="80" alt="" />
      <h1 className='text-xl font-semibold text-blue-500'>{user?.name}</h1>
      <br />
      <div className="flex w-[70%] justify-center">
        <ul className="bg-white rounded-lg border border-gray-200 w-96 text-gray-900">
          {
            links.map(({ label, link }, index) => {
              return (
                <Link to={link} key={index}>
                  <li className="px-6 py-2 border-b border-gray-200 rounded-t-lg">{label}</li>
                </Link>
              )
            })
          }
        </ul>
      </div>
    </>
  )
}

export default SideNav