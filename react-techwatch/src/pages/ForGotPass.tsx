import React, {useState} from 'react'
import { Link } from 'react-router-dom'
import { useForgotPassMutation } from '../service/auth'
import { toast } from 'react-toastify';
import Spinner from '../components/Spinner';

type ForGotPassProps = {}


const ForGotPass = (props: ForGotPassProps) => {

    const [forgotPass, {isLoading}] = useForgotPassMutation();
    const [email, setEmail] = useState<string>('');

    const handlingRequest = async (e: React.SyntheticEvent) => {
        try {
            e.preventDefault();
            let response = await forgotPass({email}).unwrap();
            toast.success(response?.message);
        } catch (error) {
            toast.error('invalid request.')
        }
    }

    if(isLoading) {
        return <Spinner />
    }

  return (
    <div className='flex w-full h-auto'>
        <div className='flex mx-auto'>
            <div className="flex h-[450px] w-[450px] p-6 rounded-lg shadow-lg bg-white mt-10">
                <form className='w-[80%] mx-auto' onSubmit={handlingRequest}>
                    <h1 className='text-2xl font-bold font-serif'>Forgot your password?</h1>
                    <br />
                    <p>Just type in your email and we will send you a code to reset your password!</p>
                    <br />
                    <div className="form-group mb-6">

                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="form-control
                            block
                            w-full
                            px-3
                            py-1.5
                            text-base
                            font-normal
                            text-gray-700
                            bg-white bg-clip-padding
                            border border-solid border-gray-300
                            rounded
                            transition
                            ease-in-out
                            m-0
                            focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" id="exampleInputEmail2"
                            aria-describedby="emailHelp" placeholder="Enter email" />
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
                    ease-in-out">Reset Password</button>
                    <p className="text-gray-800 mt-6 text-center">Already Have an account? 
                    <Link to="/signup"
                        className="text-blue-600 hover:text-blue-700 focus:text-blue-700 transition duration-200 ease-in-out"> Login</Link>
                    </p>
                </form>
            </div>
        </div>
    </div>
  )
}

export default ForGotPass