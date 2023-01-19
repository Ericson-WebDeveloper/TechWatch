import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { useRegisterUserMutation } from '../service/auth';
import { toast } from 'react-toastify';
import Spinner from '../components/Spinner';
import { useAppDispatch } from '../feature';

type SignUpProps = {}
export interface SignUpInterface {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
}

const schema = yup.object({
    name: yup.string().required(),
    email: yup.string().required().email(),
    password: yup.string().required().min(6),
    password_confirmation: yup.string()
    .oneOf([yup.ref('password'), null], 'Passwords must match'),
  });

const SignUp = (props: SignUpProps) => {
    let navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { register, handleSubmit, formState: { errors }, reset } = useForm<SignUpInterface>({
        resolver: yupResolver(schema)
    });

    const [registerUser, {data, isError, isLoading, isSuccess, error}] = useRegisterUserMutation();

    const signUpUser: SubmitHandler<SignUpInterface> = async (formData) => {
        await registerUser(formData)
    //    try {
    //         let response = await registerUser(formData).unwrap();
    //         toast.success(response.message || "Request Success");
    //         setTimeout(() => {
    //             navigate(`/signin`);
    //         }, 1500);
    //    } catch (error: any) {
    //     if(error.status === 400) {
    //         toast.error(error.data.error);
    //     } else if(error.status === 422) {
    //         let errors: any = error.data.errors;
    //         let keys = Object.keys(error.data.errors);
    //         keys.forEach((key) => {
    //             let key1 = key as string;
    //             toast.error(errors[key1 as keyof typeof errors][0])
    //         })
    //     } else {
    //         toast.error(error.data.error || error.data.message);
    //     }
    //    }
    }

    useEffect(() => {
        if(isError && error) {
            if('data' in error) {
                const response: any = error.data;
                if(error.status === 400) {
                    toast.error(response.error);
                } else if(error.status === 422) {
                    let errors: any = response.errors;
                    let keys = Object.keys(response.errors);
                    keys.forEach((key) => {
                        let key1 = key as string;
                        toast.error(errors[key1 as keyof typeof errors][0])
                    })
                } else {
                    toast.error(response.error || response.message);
                }
            }
        }
        if(isSuccess) {
            if(data) {
                const response: any = data;
                toast.success(response.message || "Request Success");
                reset();
                setTimeout(() => {
                    navigate(`/signin`);
                }, 1000);
            }
        }
    }, [isSuccess, data, error, isError, dispatch, navigate, reset])

    if(isLoading) {
        return <Spinner />
    }

  return (
    <div className='flex w-full h-auto'>
        <div className='flex mx-auto'>
            <div className="flex w-[450px] p-6 rounded-lg shadow-lg bg-white mt-10">
                <form className='w-[80%] mx-auto' onSubmit={handleSubmit(signUpUser)}>
                <h1 className='text-4xl font-bold font-serif'>Register</h1>
                <br />
                    <div className="form-group mb-6">
                        <label htmlFor="exampleInputEmail2" className="form-label inline-block mb-2 text-gray-700">Full Name</label>
                        <input type="text" 
                        {...register("name")} className="form-control block w-full px-3  py-1.5 text-base font-normal
                            text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out  m-0
                            focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" id="exampleInputEmail2"
                            aria-describedby="emailHelp" placeholder="Enter Full Name" />
                        <p className='text-red-600 font-semibold'>{errors.name?.message}</p>
                    </div>
                    <div className="form-group mb-6">
                        <label htmlFor="exampleInputEmail2" className="form-label inline-block mb-2 text-gray-700">Email address</label>
                        <input type="email" 
                        {...register("email")} className="form-control block  w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding
                            border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" id="exampleInputEmail2"
                            aria-describedby="emailHelp" placeholder="Enter email" />
                            <p className='text-red-600 font-semibold'>{errors.email?.message}</p>
                    </div>
                    <div className="form-group mb-6">
                        <label htmlFor="exampleInputPassword2" className="form-label inline-block mb-2 text-gray-700">Password</label>
                        <input type="password" 
                        {...register("password")} className="form-control block
                            w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition
                            ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" id="exampleInputPassword2"
                            placeholder="Password" />
                            <p className='text-red-600 font-semibold'>{errors.password?.message}</p>
                    </div>
                    <div className="form-group mb-6">
                        <label htmlFor="exampleInputPassword2" className="form-label inline-block mb-2 text-gray-700">Confirm Password</label>
                        <input type="password" 
                        {...register("password_confirmation")} className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300
                            rounded transition ease-in-out m-0
                            focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" id="exampleInputPassword2"
                            placeholder="Password" />
                             <p className='text-red-600 font-semibold'>{errors.password_confirmation?.message}</p>
                    </div>
  
                    
                    <button type="submit" className=" w-full px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md
                    hover:bg-blue-700 hover:shadow-lg
                    focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0
                    active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out">Sign Up</button>
                    <p className="text-gray-800 mt-6 text-center">Already Have an account? <Link to="/signin"
                        className="text-blue-600 hover:text-blue-700 focus:text-blue-700 transition duration-200 ease-in-out">Login</Link>
                    </p>
                </form>
            </div>
        </div>
    </div>
  )
}

export default SignUp