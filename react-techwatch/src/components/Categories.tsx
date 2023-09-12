import React from 'react'
import { useSearchParams } from 'react-router-dom';

type CategoriesProps = {
    // setCategory: SetURLSearchParams;
}

const Categories = (props: CategoriesProps) => {
    const [pagen, setFilter] = useSearchParams();
  return (
    <div className="w-60 h-[450px] shadow-md bg-white px-1 mt-4">
        <ul className="relative">
            <li className="relative">
                <span onClick={() => setFilter({filter: 'all'})} className="flex items-center text-sm py-4 px-6 h-12 overflow-hidden text-gray-700 text-ellipsis
                 whitespace-nowrap rounded hover:text-gray-900 hover:bg-gray-100 transition duration-300 ease-in-out cursor-pointer" 
                 data-mdb-ripple="true" data-mdb-ripple-color="dark">
                    <span>All</span>
                </span>
            </li>
            <li className="relative">
                <span onClick={() => setFilter({filter:'G-Shock'})} className="flex items-center text-sm py-4 px-6 h-12 overflow-hidden text-gray-700 text-ellipsis 
                whitespace-nowrap rounded hover:text-gray-900 hover:bg-gray-100 transition duration-300 ease-in-out cursor-pointer" data-mdb-ripple="true" 
                data-mdb-ripple-color="dark">
                    <span>G-Shock</span>
                </span>
            </li>
            <li className="relative">
                <span onClick={() => setFilter({filter:'Timex'})} className="flex items-center text-sm py-4 px-6 h-12 overflow-hidden text-gray-700 text-ellipsis 
                whitespace-nowrap rounded
                hover:text-gray-900 hover:bg-gray-100 transition duration-300 ease-in-out cursor-pointer" data-mdb-ripple="true" data-mdb-ripple-color="dark">
                    <span>Timex</span>
                </span>
            </li>
            <li className="relative">
                <span onClick={() => setFilter({filter:'Shinola'})} className="flex items-center text-sm py-4 px-6 h-12 overflow-hidden text-gray-700 text-ellipsis whitespace-nowrap 
                rounded hover:text-gray-900 hover:bg-gray-100 transition duration-300 ease-in-out cursor-pointer" data-mdb-ripple="true" data-mdb-ripple-color="dark">
                    <span>Shinola</span>
                </span>
            </li>
            <li className="relative">
                <span onClick={() => setFilter({filter:'Mazzucato'})} className="flex items-center text-sm py-4 px-6 h-12 overflow-hidden text-gray-700 text-ellipsis whitespace-nowrap 
                rounded hover:text-gray-900 hover:bg-gray-100 transition duration-300 ease-in-out cursor-pointer" data-mdb-ripple="true" data-mdb-ripple-color="dark">
                    <span>Mazzucato</span>
                </span>
            </li>
            <li className="relative">
                <span onClick={() => setFilter({filter:'Archetype'})} className="flex items-center text-sm py-4 px-6 h-12 overflow-hidden text-gray-700 text-ellipsis whitespace-nowrap 
                rounded hover:text-gray-900 hover:bg-gray-100 transition duration-300 ease-in-out cursor-pointer" data-mdb-ripple="true" data-mdb-ripple-color="dark">
                    <span>Archetype</span>
                </span>
            </li>
        </ul>
    </div>
  )
}

export default Categories
