import React, { useEffect, useMemo } from 'react';
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { useAppDispatch } from '../../feature';
import { BiilingAddInterface } from '../../models/BillingAddress';
import { useUpdateBillingCredMutation } from '../../service/User';
import { toast } from 'react-toastify';
import { SET_BILLING_ADDR } from '../../feature/user/userSlice';
import Spinner from '../Spinner';

type BillingFormProps = {
    billing: BiilingAddInterface | null
}

const schema = yup.object({
    province: yup.string().required(),
    city: yup.string().required(),
    zip_code: yup.number().required(),
    barangay: yup.string().required(),
    street: yup.string().required(),
    house_no: yup.number().required(),
  });
  
  export interface updateBillingAddInterface {
    province: string;
    city: string;
    zip_code: number;
    barangay: string;
    street: string;
    house_no: number;
  }

const BillingForm = ({billing}: BillingFormProps) => {
    const { register, handleSubmit, watch, formState: { errors }, reset, setValue } = useForm<updateBillingAddInterface>({
        resolver: yupResolver(schema)
    });
    const dispatch = useAppDispatch();

    const [updateBillingCred, {data: updateResponse, isError: ErrorUpdatedBilling, 
        isLoading, isSuccess: SuccessUpdateBilling, error: errorResponse}] = useUpdateBillingCredMutation();

    const updateBiilingAdd: SubmitHandler<updateBillingAddInterface> = async (formData) => {
        await updateBillingCred(formData);
    }

    // useEffect(() => {
    //     if (billing) {
    //         setValue('province', billing?.province);
    //         setValue('city', billing?.city);
    //         setValue('zip_code', billing?.zip_code || 0);
    //         setValue('barangay', billing?.barangay);
    //         setValue('street', billing?.street);
    //         setValue('house_no', billing?.house_no || 0);
    //     }
    // }, [billing]);

    useEffect(() => {
        if(ErrorUpdatedBilling && errorResponse) {
            if('data' in errorResponse) {
                const response: any = errorResponse.data;
                if(errorResponse.status === 400) {
                    toast.error(response.error);
                } else if(errorResponse.status === 422) {
                    // loop errors
                } else {
                    toast.error(response.error || response.message);
                }
            }
        }
        if(SuccessUpdateBilling) {
            if(updateResponse) {
                const response: any = updateResponse.data;
                dispatch(SET_BILLING_ADDR(response.billing))
                toast.success("Info Updated Success!");
            }
        }
    
    }, [SuccessUpdateBilling, updateResponse, errorResponse, ErrorUpdatedBilling, dispatch])

    if(isLoading) {
        return <Spinner />
    }

  return (
    <>
        <form action="" onSubmit={handleSubmit(updateBiilingAdd)}>
        <div className='flex flex-col lg:flex-row justify-between'>
            <div className="form-group mb-6">
                <label htmlFor="province" className="form-label inline-block mb-2 text-gray-700">Province</label>
                <input type="text" {...register('province')} className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700
                    bg-white bg-clip-padding border border-solid border-gray-300 rounded transition  ease-in-out  m-0
                    focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" id="province" 
                    placeholder="Enter Province" defaultValue={billing?.province ? billing?.province : ''}/>
                     <p className='text-red-600 font-semibold'>{errors.province?.message}</p>
            </div>
            <div className="form-group mb-6">
                <label htmlFor="city" className="form-label inline-block mb-2 text-gray-700">City</label>
                <input type="text" {...register('city')} className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700
                    bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out  m-0
                    focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" id="city"
                    aria-describedby="emailHelp" placeholder="Enter City" defaultValue={billing?.city ? billing?.city : ''} />
                    <p className='text-red-600 font-semibold'>{errors.city?.message}</p>
            </div>
            
        </div>

        <div className='flex flex-col lg:flex-row justify-between'>
            <div className="form-group mb-6">
                <label htmlFor="zip_code" className="form-label inline-block mb-2 text-gray-700">Zip Code</label>
                <input type="number" {...register('zip_code')} className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700
                    bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0
                    focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" id="zip_code" placeholder="Enter Zip Code" 
                    defaultValue={billing?.zip_code ? billing?.zip_code : 0}/>
                    <p className='text-red-600 font-semibold'>{errors.zip_code?.message}</p>
            </div>
            <div className="form-group mb-6">
                <label htmlFor="barangay" className="form-label inline-block mb-2 text-gray-700">Barangay</label>
                <input type="text" {...register('barangay')} className="form-control block w-full px-3 py-1.5 text-base font-normal
                    text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0
                    focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" id="barangay"
                    aria-describedby="emailHelp" placeholder="Enter Barangay" defaultValue={billing?.barangay ? billing?.barangay : ''} />
                    <p className='text-red-600 font-semibold'>{errors.barangay?.message}</p>
            </div>

            
            
        </div>
        <div className='flex flex-col lg:flex-row justify-between'>
           <div className="form-group mb-6">
                <label htmlFor="street" className="form-label inline-block mb-2 text-gray-700">Street</label>
                <input type="text" {...register('street')} className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border 
                border-solid border-gray-300 rounded transition ease-in-out m-0 first-line:focus:text-gray-700 focus:bg-white focus:border-blue-600 
                focus:outline-none" id="street" placeholder="Enter Street" defaultValue={billing?.street ? billing?.street : ''} />
                <p className='text-red-600 font-semibold'>{errors.street?.message}</p>
            </div>
            <div className="form-group mb-6">
                <label htmlFor="house_no" className="form-label inline-block mb-2 text-gray-700">House No*</label>
                <input type="number" {...register('house_no')} className="form-control block w-full px-3 py-1.5 text-base font-normal
                    text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0
                    focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" id="house_no" placeholder="Enter House No" 
                    defaultValue={billing?.house_no ? billing?.house_no : 0} />
                    <p className='text-red-600 font-semibold'>{errors.house_no?.message}</p>
            </div>
            
            </div>
            <button type="submit" className="w-full px-6 py-2.5 bg-[#01C17D] text-white font-medium text-xs leading-tight uppercase rounded
            shadow-md hover:bg-[#11998E] hover:shadow-lg focus:bg-[#11998E] focus:shadow-lg focus:outline-none focus:ring-0 active:bg-[#11998E] 
            active:shadow-lg transition duration-150 ease-in-out">Add/Update Billing Address</button>
        </form>
    </>
  )
}

export default BillingForm