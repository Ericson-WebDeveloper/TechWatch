import React, { useEffect, useRef} from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom';
import Spinner from '../../components/Spinner';
import { RESTART_CART, SET_TOTALPRICE, SET_TOTALQTY } from '../../feature/cart/cartSlice';
import { useAppSelector, useAppDispatch } from '../../feature/index';
import { usePayPaypalCaptureCancelMutation, usePayPaypalCaptureMutation } from '../../service/Payment';

type PaymentProcessProps = {}

export interface paymentDataResponseInterface {
  approvalId: string;
  PayerID: string;
  order_id: string,
  token: string;
}

function PaymentProcess(props: PaymentProcessProps) {
  const {cart} = useAppSelector(state => state.cart)
  let [queryParams, setQueryParams] = useSearchParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [payPaypalCapture, {isLoading: paypalCaptureLoading}] = usePayPaypalCaptureMutation();
  const [payPaypalCaptureCancel, {isLoading: paypalCaptureCancelLoading}] = usePayPaypalCaptureCancelMutation();
  const shouldRun = useRef(true)

  let approval_id = localStorage.getItem('approvalId') ? JSON.parse(JSON.stringify(localStorage.getItem('approvalId'))) : '';
  let order_id = localStorage.getItem('order_id') ? JSON.parse(JSON.stringify(localStorage.getItem('order_id'))) : '';
  let PayerID = queryParams.get('PayerID') ? JSON.parse(JSON.stringify(queryParams.get('PayerID'))) : '';
  let token = queryParams.get('token') ? JSON.parse(JSON.stringify(queryParams.get('token'))) : '';

  const removingRefs = () => {
    localStorage.removeItem('order_id');
    localStorage.removeItem('approvalId');
  }

  const capturePaymentProcess = async () => {
    if(!queryParams.get('PayerID') || !queryParams.get('token') || !queryParams.get('success') ) {
      alert('You dont have pay to process')
      navigate('/');
    }
    
    try {
      if(queryParams.get('success') == 'true') {

        let paymentDataresponse: paymentDataResponseInterface = {
          approvalId: approval_id ?? '',
          order_id: order_id ?? '',
          PayerID: PayerID ?? '',
          token: token ?? ''
        }
          await payPaypalCapture(paymentDataresponse).unwrap();

            removingRefs();
            localStorage.removeItem('cart');
            dispatch(RESTART_CART());
            dispatch(SET_TOTALQTY());
            dispatch(SET_TOTALPRICE());
            
            navigate({
              pathname: `/payment/${true}/page`,
              search: `?orderId=${order_id}&paymentId=${approval_id}&PayerID=${PayerID}&token=${token}`,
            });

      }
    } catch (error) {
      // let approvalId = localStorage.getItem('approvalId');
      // let order_id = localStorage.getItem('order_id') ? localStorage.getItem('order_id') : '';
      await payPaypalCaptureCancel({orderId: order_id ?? ''}).unwrap();
      removingRefs();
      dispatch(SET_TOTALQTY());
      dispatch(SET_TOTALPRICE());
      navigate({
        pathname: `/payment/${false}/page`,
        search: `?orderId=${order_id}&paymentId=${approval_id}&PayerID=${PayerID}&token=${token}`,
      });
    }
  }

  useEffect(() => {
    if(shouldRun.current) {
      shouldRun.current = false;
      capturePaymentProcess();
    }
  }, []);

  if(paypalCaptureLoading || paypalCaptureCancelLoading) {
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