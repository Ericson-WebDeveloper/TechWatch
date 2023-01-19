import React, { useEffect, useRef } from 'react'
import { toast } from 'react-toastify';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAppDispatch } from '../../feature';
import { SET_TOTALPRICE, SET_TOTALQTY } from '../../feature/cart/cartSlice';
import { usePayPaypalCaptureCancelMutation, usePayStripeCardCaptureMutation } from '../../service/Payment';
import Spinner from '../../components/Spinner';
import {RESTART_CART} from '../../feature/cart/cartSlice'

type PaymentProcessProps = {}

const PaymentProcess = (props: PaymentProcessProps) => {
  const navigate = useNavigate();
  const shouldRun = useRef(true);
  let [queryParams, setQueryParams] = useSearchParams();

  let orderId = localStorage.getItem('order_id') ? JSON.parse(JSON.stringify(localStorage.getItem('order_id'))) : null;
  let approvalId = localStorage.getItem('approvalId') ? JSON.parse(JSON.stringify(localStorage.getItem('approvalId'))) : null;

  const dispatch = useAppDispatch();

  const [payPaypalCaptureCancel, {isLoading: paypalCaptureCancelLoading}] = usePayPaypalCaptureCancelMutation();
  const [payStripeCardCapture, {isLoading: stripeCaptureLoading}] = usePayStripeCardCaptureMutation();

  const removingRefs = () => {
    localStorage.removeItem('approvalId');
    localStorage.removeItem('order_id');
  }

  const verifyPaymentCard = async () => {
    
    if(!orderId || !approvalId) {
      toast.error('You are not allowed to access this page');
      navigate('/');
      return false;
    }

    if(queryParams.get('success')) {
      const data = {
        approvalId: approvalId,
        order_id: orderId
      }
      try {
        await payStripeCardCapture(data);
        navigate({
          pathname: `/payment/${true}/card`,
          search: `?orderId=${orderId}&paymentId=${approvalId}`,
        });
      } catch (error) {
        toast.error('Something wrong in System App.Payment Cancel');
        navigate({
          pathname: `/payment/${true}/card`,
          search: `?orderId=${orderId}&paymentId=${approvalId}`,
        });
      } finally {
        dispatch(RESTART_CART());
        removingRefs();
        dispatch(SET_TOTALQTY());
        dispatch(SET_TOTALPRICE());
      }
      
    } else {
      try {
        await payPaypalCaptureCancel({orderId: orderId ?? ''}).unwrap();
        navigate({
          pathname: `/payment/${false}/card`,
          search: `?orderId=${orderId}&paymentId=${approvalId}`
        });
      } catch (error) {
        // removingRefs();
        toast.error('Something wrong in System App');
        navigate('/');
      } finally {
        removingRefs();
        dispatch(SET_TOTALQTY());
        dispatch(SET_TOTALPRICE());
      }
    }

  }

  useEffect(() => {
    if(shouldRun.current) {
      shouldRun.current = false;
      verifyPaymentCard();
    }
    
  }, [])

  if(paypalCaptureCancelLoading || stripeCaptureLoading) {
    return <Spinner />
  }
  return (
    <div className='flex w-full h-screen'>
        <div className='flex h-full lg:h-[600px] w-full mx-auto mt-5'>
            <div className="flex flex-row w-full p-6">
                <h1 className='text-4xl font-serif font-semibold mx-auto'>Payment Processing please wait..........</h1>
            </div>
        </div>
    </div>
  )
}

export default PaymentProcess