import React, { useEffect } from 'react'
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { useUpdateInfoMutation } from '../../service/User';
import Spinner from '../Spinner';
import { toast } from 'react-toastify';
import { SET_USER } from '../../feature/user/userSlice';
import { useAppDispatch } from '../../feature';
import { userInterface } from '../../models/User';

type Props = {
  user: userInterface | null;
}

const schema = yup.object({
  name: yup.string().required(),
  email: yup.string().required().email(),
});

export interface updateInfoInterface {
  name: string;
  email: string;
}

const UserInfo = ({user}: Props) => {
  const dispatch = useAppDispatch();
  const { register, handleSubmit, watch, formState: { errors }, reset } = useForm<updateInfoInterface>({
    resolver: yupResolver(schema)
  });
  const [updateInfo, {data: updateResponse, isError, isLoading, isSuccess, error}] = useUpdateInfoMutation();

  const updateInformation: SubmitHandler<updateInfoInterface> = async (formData) => {
    await updateInfo(formData);
  }

  useEffect(() => {
    if(isError && error) {
        if('data' in error) {
            const response: any = error.data;
            if(error.status === 400) {
                toast.error(response.error);
            } else if(error.status === 422) {
                // loop errors
            } else {
                toast.error(response.error || response.message);
            }
        }
    }
    if(isSuccess) {
        if(updateResponse) {
            const response: any = updateResponse.data;
            dispatch(SET_USER(response.user));
            toast.success("Info Updated Success!");
            reset();
        }
    }

}, [isSuccess, updateResponse, error, isError, dispatch, reset])

  if(isLoading) {
    return <Spinner />
  }


  return (
    <><form action="" onSubmit={handleSubmit(updateInformation)}>
        <div className='flex flex-col lg:flex-row justify-between'>
            
              <div className="form-group mb-6">
                  <label htmlFor="exampleInputEmail2" className="form-label inline-block mb-2 text-gray-700">Full Name</label>
                  <input type="text" {...register('name', { value: user?.name })} className="form-control block w-full px-3 py-1.5 text-base font-normal
                      text-gray-700bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0
                      focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" id="exampleInputEmail2"
                      placeholder="Enter Name" />
                      <p className='text-red-600 font-semibold'>{errors.name?.message}</p>
              </div>
              <div className="form-group mb-6">
                  <label htmlFor="exampleInputEmail2" className="form-label inline-block mb-2 text-gray-700">Email Address</label>
                  <input type="email" {...register('email', { value: user?.email })} className="form-control block w-full px-3 py-1.5
                      text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded
                      transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" id="exampleInputEmail2"
                      aria-describedby="emailHelp" placeholder="Enter email" />
                      <p className='text-red-600 font-semibold'>{errors.email?.message}</p>
              </div>
           
        </div>
        <button type="submit" className=" w-full px-6 py-2.5 bg-[#01C17D] text-white font-medium text-xs leading-tight uppercase rounded
            shadow-md hover:bg-[#11998E] hover:shadow-lg focus:bg-[#11998E] focus:shadow-lg focus:outline-none focus:ring-0 active:bg-[#11998E] 
            active:shadow-lg transition duration-150 ease-in-out">Update Info</button> 
          </form>
    </>
  )
}

export default UserInfo