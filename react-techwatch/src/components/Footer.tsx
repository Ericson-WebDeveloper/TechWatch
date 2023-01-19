import React from 'react'
import { useLocation } from 'react-router-dom';

type Props = {}

const Footer = (props: Props) => {
  let location = useLocation();

  return (
    <footer className={`${(location.pathname === '/signin' || location.pathname === '/signup' 
    || location.pathname === '/forgot-password' || location.pathname === '/reset-password') ? 'absolute inset-x-0' : ''} bg-[#FFFFFF] 
    text-center lg:text-left bottom-0 w-full`}>
      <div className="  text-gray-700 text-center p-4" >
        {/* style={{ backgroundColor: "rgba(0, 0, 0, 0.2)" }} */}
        © 2022 Copyright:
        <a className="text-gray-800" href="https://tailwind-elements.com/">TechWatch Ecommerce APp</a>
      </div>
</footer>
  )
}

export default Footer