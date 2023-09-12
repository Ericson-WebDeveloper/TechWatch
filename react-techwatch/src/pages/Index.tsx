import React, {useState} from 'react'
import Categories from '../components/Categories'
import Product from '../components/Product';
import Spinner from '../components/Spinner';
import { useGetProductsQuery } from '../service/products'
// import { toast } from 'react-toastify';
import { useSearchParams } from "react-router-dom";

type IndexProps = {}

const Index = (props: IndexProps) => {
  let [searchCategory, setSearchCategory] = useSearchParams();
 
  const { data, error, isLoading } = useGetProductsQuery(searchCategory.get('filter') || 'all')

  
  if(isLoading) {
    return <Spinner />
  }

  return (
    <div className='flex w-full h-auto'>
      <div className='flex flex-row w-full space-x-6'>
          <Categories />
          <div className='mt-4'>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {
                  data?.products?.map((product, index) => {
                    return <Product key={index} product={product} />
                  })
                }
            </div>
          </div>
      </div>
    </div>
  )
}

export default Index
