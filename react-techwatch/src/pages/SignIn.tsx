import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { useLoginUserMutation, useLoginUserSocialMutation } from '../service/auth';
import Spinner from '../components/Spinner';
import { toast } from 'react-toastify';
import { useAppDispatch } from '../feature';
import { SET_TOKEN, SET_USER } from '../feature/user/userSlice';

type SignInProps = {}

export interface SigInInterface {
    email: string;
    password: string;
}

const schema = yup.object({
    email: yup.string().required().email(),
    password: yup.string().required().min(6),
  }).required();

const SignIn = (props: SignInProps) => {
    let navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { register, handleSubmit, watch, formState: { errors } } = useForm<SigInInterface>({
        resolver: yupResolver(schema)
      });
    const [loginUser, {data, isError, isLoading, isSuccess, error}] = useLoginUserMutation();
    const [loginUserSocial, {isLoading: socialLoginLoading}] = useLoginUserSocialMutation();

    const onSubmit: SubmitHandler<SigInInterface> = async (formData) => {
        await (loginUser(formData));
        // console.log('here data ', data);
        // console.log('here isLoading ', isLoading);
        // console.log('here isError ', isError);
        // console.log('here isSuccess ', isSuccess);
        // console.log('here error ', error);
    };

    const loginwith = async (provider: string) => {
        try {
            let response = await loginUserSocial(provider).unwrap();
            if(response?.link) {
                window.location.replace(response.link)
            }
        } catch (error) {
            toast.error('Cannot Login. Please Try Again Later');
        }
        
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
            if(data) {
                const response: any = data;
                dispatch(SET_USER(response.data.user));
                dispatch(SET_TOKEN(response.data.token));
                navigate(`/`);
            }
        }
    }, [isSuccess, data, error, isError, dispatch, navigate])

    if(isLoading || socialLoginLoading) {
        return <Spinner />
    }
    // console.log(watch("email")); // watch input value by passing the name of it;
    // console.log(errors);
  return (
    <div className='flex w-full h-auto'>
        <div className='flex mx-auto'>
            <div className="flex h-[550px] w-[450px] p-6 rounded-lg shadow-lg bg-white mt-10">
                <form className='w-[80%] mx-auto' onSubmit={handleSubmit(onSubmit)}>
                <h1 className='text-4xl font-bold font-serif'>Login</h1>
                <br />
                    <div className="form-group mb-6">
                        <label htmlFor="exampleInputEmail2" className="form-label inline-block mb-2 text-gray-700">Email address</label>
                        <input type="email" {...register("email", { required: true })} className="form-control block w-full px-3  py-1.5 text-base font-normal
                            text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0
                            focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" id="exampleInputEmail2"
                            aria-describedby="emailHelp" placeholder="Enter email" />
                        <p className='text-red-600 font-semibold'>{errors.email?.message}</p>
                    </div>
                    <div className="form-group mb-6">
                    <label htmlFor="exampleInputPassword2" className="form-label inline-block mb-2 text-gray-700">Password</label>
                    <input type="password" {...register("password", { required: true, minLength: 7})} className="form-control block
                        w-full px-3 py-1.5 text-base font-normal text-gray-700bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0
                        focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" id="exampleInputPassword2"
                        placeholder="Password" />
                        <p className='text-red-600 font-semibold'>{errors.password?.message}</p>
                    </div>
                    <div className="flex justify-between items-center mb-6">
                        <Link to="/forgot-password"
                            className="text-blue-600 hover:text-blue-700 focus:text-blue-700 transition duration-200 ease-in-out">Forgot
                            password?</Link>
                    </div>
                    <p>Login w:</p>
                    <div className="flex justify-between items-center mb-6">
                        <button type="button" className="inline-block px-6 py-2.5 mb-2 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg transition duration-150 ease-in-out" 
                        style={{ backgroundColor: '#1877f2' }}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" className="w-4 h-4">
                            <path fill="currentColor" d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z"/>
                            </svg>
                        </button>
                        <button type="button" onClick={() => loginwith('github')} className="inline-block px-6 py-2.5 mb-2 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg transition duration-150 ease-in-out" style={{ backgroundColor: "#333" }}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512" className="w-4 h-4">
                            <path fill="currentColor" d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"/>
                            </svg>
                        </button>
                        <button type="button" onClick={() => loginwith('google')} className="inline-block px-6 py-2.5 mb-2 text-white font-medium text-xs leading-tight uppercase 
                        rounded shadow-md hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg transition duration-150 ease-in-out" style={{ backgroundColor: "#ea4335" }}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512" className="w-4 h-4">
                            <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 
                            256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"/>
                            </svg>
                        </button>
                    </div>
                    
                    <button type="submit" className="
                    w-full
                    px-6
                    py-2.5
                    bg-blue-600
                    text-white
                    font-medium
                    text-xs
                    leading-tight
                    uppercase
                    rounded
                    shadow-md
                    hover:bg-blue-700 hover:shadow-lg
                    focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0
                    active:bg-blue-800 active:shadow-lg
                    transition
                    duration-150
                    ease-in-out">Sign in</button>
                    <p className="text-gray-800 mt-6 text-center">Dont Have an account? <Link to="/signup"
                        className="text-blue-600 hover:text-blue-700 focus:text-blue-700 transition duration-200 ease-in-out"> Register</Link>
                    </p>
                </form>
            </div>
        </div>

        
    </div>
  )
}

export default SignIn