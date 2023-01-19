import React from 'react'

type BarNavProps = {}

const BarNav = (props: BarNavProps) => {
  return (
    <>
        <nav className="relative w-full flex flex-wrap items-center
        py-3 bg-[#01C17D] text-gray-500 hover:text-gray-700 focus:text-gray-700 shadow-lg">
            <div className=" w-full flex flex-wrap items-center px-6">
                <div className="text-center mx-auto">
                    <h1 className="text-2xl font-serif text-white ">Premium Watch Available Here</h1>
                </div>
            </div>
        </nav>
    </>
  )
}

export default BarNav