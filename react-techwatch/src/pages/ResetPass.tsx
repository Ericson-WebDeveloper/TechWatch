import React, {useState} from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Spinner from '../components/Spinner';
import { useResetPassMutation } from '../service/auth';

type ResetPassProps = {};

export interface IResetPass {
    code: string;
    password:string;
}

const ResetPass = (props: ResetPassProps) => {
    const [passwords, setPasswords] = useState<{password:string,confirm_password:string}>({password: '', confirm_password: ''});
    const [resetPass, {isLoading}] = useResetPassMutation();
    const [param, setParam] = useSearchParams()

    const handlingRequest = async (e: React.SyntheticEvent) => {
        try {
            e.preventDefault();
            if(!param.get('code')) {
                return;
            }
            if(passwords.password !== passwords.confirm_password) {
                return;
            }
            const data = {
                password: passwords.password,
                code: param.get('code')!
            }
            await resetPass(data).unwrap();
            toast.success('Password Updated Success. You Can Login Now!.');
            setPasswords({
                password: '', confirm_password: ''
            })
        } catch (error: any) {
            toast.error('Password Updated Failed. please try again later.')
        }
    }

    if(isLoading) {
        return <Spinner />
    }
  return (
    <div className='flex w-full h-auto'>
        <div className='flex mx-auto'>
            <div className="flex w-[450px] p-6 rounded-lg shadow-lg bg-white mt-10">
               
                <form className='w-[80%] mx-auto' onSubmit={handlingRequest}>
                <h1 className='text-2xl font-bold font-serif'>Reset your password</h1>
                <br />
                    <div className="form-group mb-6">
                        <label htmlFor="exampleInputPassword2" className="form-label inline-block mb-2 text-gray-700">Password</label>
                        <input type="password" name='password' value={passwords.password} 
                        onChange={(e) => setPasswords((prev) => ({...prev, [e.target.name]: e.target.value}))} className="form-control block
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
                            focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" id="exampleInputPassword2"
                            placeholder="Password" />
                    </div>
                    <div className="form-group mb-6">
                        <label htmlFor="exampleInputPassword2" className="form-label inline-block mb-2 text-gray-700">Confirm Password</label>
                        <input type="password" name='confirm_password' value={passwords.confirm_password} 
                        onChange={(e) => setPasswords((prev) => ({...prev, [e.target.name]: e.target.value}))}  className="form-control block
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
                            focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" id="exampleInputPassword2"
                            placeholder="Password" />
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
                    <p className="text-gray-800 mt-6 text-center">Already Have an account? <Link to="/signin"
                        className="text-blue-600 hover:text-blue-700 focus:text-blue-700 transition duration-200 ease-in-out">Login</Link>
                    </p>
                </form>
            </div>
        </div>
    </div>
  )
}

export default ResetPass