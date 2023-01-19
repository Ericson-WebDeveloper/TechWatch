import React, { useEffect, useRef } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import Spinner from '../components/Spinner';
import { useLoginSocialMutation } from '../service/auth';
import { useDispatch } from 'react-redux';
import { useAppDispatch } from '../feature';
import { SET_TOKEN, SET_USER } from '../feature/user/userSlice';
import { toast } from 'react-toastify';

type SignInCallBackProps = {}

export interface socialInterface {
  code: string;
  provider: string;
}

const SignInCallBack = (props: SignInCallBackProps) => {
  let { provider } = useParams();
  let navigate = useNavigate();
  const shouldRun = useRef(true);
  const dispatch = useAppDispatch();
  let [query, setQuery] = useSearchParams();
  const [loginSocial, {isLoading, isSuccess, isError}] = useLoginSocialMutation();

  const signIn = async () => {
      if(!query.get('code') || !provider) {
        navigate(`/`);
        return false;
      }
      try {
        const data = {
          code: query.get('code') as string, 
          provider: provider as string
        }
          let response = await loginSocial(data).unwrap();
          if(response){
            const responseData: any = response.data;
            dispatch(SET_USER(responseData.user));
            dispatch(SET_TOKEN(responseData.token));
            navigate(`/`);
          }
      } catch (error: any) {
        toast.error('Failed Sign In. please try Again');
        navigate(`/`);
      } 
    }

  useEffect(() => {
    if(shouldRun.current) {
      shouldRun.current = false
      signIn();
    }
  }, []);


  if(isLoading) {
    return <Spinner />
  }

  return (
    <div>SignInCallBack</div>
  )
}

export default SignInCallBack