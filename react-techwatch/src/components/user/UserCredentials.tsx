import React, { useEffect } from 'react'
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { useAppDispatch } from '../../feature';
import { useUpdateCredentialMutation } from '../../service/User';
import Spinner from '../Spinner';
import { toast } from 'react-toastify';
import { SET_USER } from '../../feature/user/userSlice';

type UserCredentialsProps = {};

const schema = yup.object({
  password: yup.string().required().min(6),
    password_confirmation: yup.string()
    .oneOf([yup.ref('password'), null], 'Passwords must match'),
});

export interface updateCredentialInterface {
  password: string;
  password_confirmation: string;
}

const UserCredentials = (props: UserCredentialsProps) => {
  const dispatch = useAppDispatch();
  const { register, handleSubmit, watch, formState: { errors }, reset } = useForm<updateCredentialInterface>({
    resolver: yupResolver(schema)
  });
  const [updateCredential, {data: updateResponse, isError: ErrorUpdatedCred, 
    isLoading, isSuccess: SuccessUpdateCred, error: errorResponse}] = useUpdateCredentialMutation();

  const updateCredentialsData: SubmitHandler<updateCredentialInterface> = async(formData) => {
    await updateCredential(formData);
  }

  useEffect(() => {
    if(ErrorUpdatedCred && errorResponse) {
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
    if(SuccessUpdateCred) {
        if(updateResponse) {
            const response: any = updateResponse.data;
            dispatch(SET_USER(response.user));
            toast.success("Info Updated Success!");
            reset();
        }
    }

}, [SuccessUpdateCred, updateResponse, errorResponse, ErrorUpdatedCred, dispatch, reset])

  if(isLoading) {
    return <Spinner />
  }

  return (
    <>
        <form action="" onSubmit={handleSubmit(updateCredentialsData)}>
          <div className='flex flex-col lg:flex-row justify-between'>
            <div className="form-group mb-6">
                <label htmlFor="password" className="form-label inline-block mb-2 text-gray-700">Password</label>
                <input type="password" {...register('password')} className="form-control block w-full px-3 py-1.5 text-base
                    font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0
                    focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" id="password"
                    aria-describedby="emailHelp" placeholder="Enter Password" />
                    <p className='text-red-600 font-semibold'>{errors.password?.message}</p>
            </div>
            <div className="form-group mb-6">
                <label htmlFor="c_password" className="form-label inline-block mb-2 text-gray-700">Password Confirm</label>
                <input type="password" {...register('password_confirmation')} className="form-control block w-full px-3 py-1.5 text-base
                    font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0
                    focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" id="c_password"
                    aria-describedby="emailHelp" placeholder="Enter Password Confirm" />
                    <p className='text-red-600 font-semibold'>{errors.password_confirmation?.message}</p>
            </div>
            
            </div>
            <button type="submit" className="w-full px-6 py-2.5 bg-[#01C17D] text-white font-medium text-xs leading-tight uppercase rounded
            shadow-md hover:bg-[#11998E] hover:shadow-lg focus:bg-[#11998E] focus:shadow-lg focus:outline-none focus:ring-0 active:bg-[#11998E] 
            active:shadow-lg transition duration-150 ease-in-out">Update Info</button>
        </form>
    </>
  )
}

export default UserCredentials