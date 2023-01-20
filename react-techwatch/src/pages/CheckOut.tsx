import React, { useEffect, useRef, useState } from 'react'
import visa from '../assets/payment_img.png';
import {loadStripe, StripeCardElement, StripeElementChangeEvent} from '@stripe/stripe-js';
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { useAppSelector } from '../feature/index';
import { toast } from 'react-toastify';
import { cartinterface } from '../models/Cart';
import { usePayPaypalMutation, usePayStripeCardMutation } from '../service/Payment';
import { useFetchBillingAddrQuery } from '../service/User';
import Spinner from '../components/Spinner';
import { useNavigate } from 'react-router-dom';

type CheckOutProps = {};

interface stripecard {
    stripe: null | any;
    stripeToken: null | string,
    cardElement: null | any,
    processing: boolean,
    card_error: null | string,
    createPaymentMethod: any | null
    //   card: {
    //     name_card: '',
    //     number: '',
    //     cvc: '',
    //     exp_month: '',
    //     exp_year: ''
    //   }
}

const schema = yup.object({
    name: yup.string().required(),
    email: yup.string().required().email(),
    barangay: yup.string().required(),
    city: yup.string().required(),
    province: yup.string().required(),
    zip_code: yup.number().required(),
    street: yup.number().required(),
});

export interface checkoutDetails {
    name: string;
    email: string;
    barangay: string;
    city: string;
    province: string;
    zip_code: number;
    house_no: number;
    street: string;
}

export interface cartDetailsInterface {
    items: cartinterface[] | null;
    amount: number;
    totatQty: number;
    payment: string;
}

interface eventResponse {
    brand: string;
    complete: boolean;
    elementType:  string;
    empty:  boolean;
    error:  {
        code: string, 
        type: string, 
        message: string
    },
    value : any;
}

const CheckOut = (props: CheckOutProps) => {
    const [stripe, setStripe] = useState<stripecard>({stripe: null, stripeToken: null,
        cardElement: null ,
        processing: false,
        card_error: null, createPaymentMethod: null});
    const navigate = useNavigate();
    let [stripeLoading, setStripeLoading] = useState(false);
    const { data: billingData, error, isLoading: fetchBillingLoading, isError, isSuccess } = useFetchBillingAddrQuery();
    const [payPaypal, {isLoading: loadigPaypalPaymentAttempt}] = usePayPaypalMutation();
    const [payStripeCard, {isLoading: loadigCardPaymentAttempt}] = usePayStripeCardMutation();
    const {cart, totalQty} = useAppSelector(state => state.cart)
    const shouldRUn = useRef(true);
    const {user} = useAppSelector(state => state.user);

    const divRef = useRef<HTMLDivElement | null>(null);

    const { register, handleSubmit, formState: { errors }, reset } = useForm<checkoutDetails>({
        resolver: yupResolver(schema)
      });
    const [formdata, setFormData] = useState<checkoutDetails>({
        name: user?.name ? user?.name : '', 
        email: user?.email ? user?.email : '', 
        barangay: '', 
        city: '', 
        province:  '', 
        zip_code: 0, 
        house_no:  0, 
        street:  ''
    });
    const { name, email, barangay, city, province, zip_code, house_no, street } = formdata;

    const payWithCard = async () => {
        
        if(checkingDetails() === false){
            toast.error('Biiling Details Invalid');
            return false;
        }
        try {
            let {paymentMethod, error} = await stripe.stripe.createPaymentMethod({ // get payment method id token from stipe
                    type: 'card',
                    card: stripe?.cardElement,
                        billing_details: {
                        name: name,
                        email: email
                    },
                });
                // console.log('here')
            if(error) {
                toast.error(error.message);
                return false;
            } else {
                // get paymentmethod id 
                stripe.stripeToken = paymentMethod.id
                // console.log(paymentMethod.id);
                await cardPayment(); // set the submition to pay to stripe
            }
        } catch (error) {
            toast.error('Cannot Pay with card');
        }
    }

    const setUpStripeCard = async () => {
        setStripeLoading(true);
        stripe.stripe = await loadStripe(process.env.REACT_APP_STRIPE_PUBLICKEY || '');    
        let elements = stripe.stripe.elements();
        let c = elements.create('card');
        setStripe((prev) => ({...prev, 'cardElement': c}));
        setStripeLoading(false);
    }

    const cardPayment = async () => { // finally this part is where ready to pay the order to backend
        try {
            let billingdetails: checkoutDetails = {
                name: name,
                email: email,
                province: province,
                city: city,
                barangay: barangay,
                street: street,
                house_no: house_no,
                zip_code: zip_code
            }
            let cartDetails: cartDetailsInterface & {stripeToken: string} = {
                items: cart,
                amount: 1.00, 
                totatQty: totalQty,
                payment: 'card',
                stripeToken: stripe.stripeToken as string
            }
            let dataPayment = {
                ...cartDetails,
                details: {
                    ...billingdetails
                }
            }
            let response: any = await payStripeCard(dataPayment).unwrap();

            localStorage.setItem('approvalId', response.approvalId)
            localStorage.setItem('order_id', response.order_id);
            navigate({
                pathname: `/payment-done/card`,
                search: `?success=${true}`,
            });
          } catch (error) {
              toast.error('Cannot Pay with Card!.');
              navigate('/')
          }
      }

    useEffect(() => {
       if(stripe.cardElement) {
            setTimeout(() => {
                stripe.cardElement.mount("#card-container");
                stripe.cardElement.on('change', (event: eventResponse) => {
                    if (event.error) {
                        setStripe((prev) => ({...prev, 'card_error': event.error.message}));
                        setStripe((prev) => ({...prev, 'processing': false}));
                    } else {
                        setStripe((prev) => ({...prev, 'card_error': null}));
                        setStripe((prev) => ({...prev, 'processing': true}));
                    }
                });
            }, 2000);
        }
    }, [stripe.cardElement, stripe])

    useEffect(() => {
       const Run = async () => {
        if(shouldRUn.current) {
            shouldRUn.current = false;
            await setUpStripeCard();
        }
       }
       Run();
    }, []);

    useEffect(() => {
        if(billingData) {
            const data: any = billingData.data;
            const billingAddr = {
                'barangay': data?.billing?.barangay,
                'city': data?.billing?.city,
                'province': data?.billing?.province,
                'zip_code': data?.billing?.zip_code,
                'house_no': data?.billing?.house_no,
                'street': data?.billing?.street
            }
            setFormData((prev) => ({...prev, ...billingAddr}))
        }
    }, [billingData])

    if(loadigPaypalPaymentAttempt || loadigCardPaymentAttempt) {
        return <Spinner />;
    }

   
    const checkingDetails = () => {
        if(!name || !email || !barangay || !city || !province || !zip_code || !house_no || !street) {
            return false;
        }
    }

    const payWithPaypal = async () => {
        if(checkingDetails() === false){
            toast.error('Biiling Details Invalid');
            return false;
        }
        try {
            let billingdetails: checkoutDetails = {
                name:name,
                email: email,
                province: province,
                city: city,
                barangay: barangay,
                street: street,
                house_no: house_no,
                zip_code: zip_code
            }
            let cartDetails: cartDetailsInterface = {
                items: cart,
                amount: 1.00, 
                totatQty: totalQty,
                payment: 'paypal',
            }
            let dataPayment = {
                ...cartDetails,
                details: {
                    ...billingdetails
                }
            }
            // console.log('here')
            let response: any = await payPaypal(dataPayment).unwrap();
            
            localStorage.setItem('approvalId', response?.approvalId);
            localStorage.setItem('order_id', response?.order_id);
            // get the link from paypal to redirect
            window.location.replace(response?.links);
        } catch (error) {
        //   state.error = error.response.data.error;
          toast.error('Something wrong in Payment Checkout process.!');
        } 
    }

    

    if(fetchBillingLoading || stripeLoading) {
        return <Spinner />
    }

  return (
    <div className='flex w-full h-auto'>
        <div className='flex h-full w-[80%] mx-auto mt-5'>
            <div className="flex flex-col w-full p-6 bg-gray-100">
                <h1 className='text-2xl font-medium '>CheckOut Section</h1>
                <br />
                <hr />
                <div className='flex flex-col lg:flex-row w-full h-full mt-2'>
                    <div className='flex flex-col w-full space-y-4 px-3'>
                        <h1 className='text-xl font-medium '>Billing Address</h1>
                        <div className="form-group mb-6 w-full">
                            <label htmlFor="name" className="form-label inline-block mb-2 text-gray-700">Full Name</label>
                            <input type="text" className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700
                                bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out
                                m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" name='name' id="name" 
                                placeholder="Enter Name" value={name} 
                                onChange={(e) => setFormData(prev => ({...prev, [e.target.name]: e.target.value})) } />
                            </div>
                        
                        <div className="form-group mb-6 w-full">
                            <label htmlFor="email" className="form-label inline-block mb-2 text-gray-700">Email address</label>
                            <input type="email" className="form-control block w-full px-3 py-1.5 text-base font-normal
                                text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition 
                                ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" 
                                id="email" name="email"
                                 placeholder="Enter email" value={email} 
                                 onChange={(e) => setFormData(prev => ({...prev, [e.target.name]: e.target.value})) } />
                            </div>
                        
                        <div className="form-group mb-6 w-full">
                            <label htmlFor="province" className="form-label inline-block mb-2 text-gray-700">Province</label>
                            <input type="text" className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700
                                bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out
                                m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" id="province"
                                placeholder="Province" value={province} name="province"
                                onChange={(e) => setFormData(prev => ({...prev, [e.target.name]: e.target.value})) } />
                            </div>

                        <div className="form-group mb-6 w-full">
                            <label htmlFor="city" className="form-label inline-block mb-2 text-gray-700">City</label>
                            <input type="text" className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700
                                bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out
                                m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" id="city"
                                placeholder="City" value={city} name="city"
                                onChange={(e) => setFormData(prev => ({...prev, [e.target.name]: e.target.value})) }  />
                        </div>

                        <div className="form-group mb-6 w-full">
                            <label htmlFor="barangay" className="form-label inline-block mb-2 text-gray-700">Barangay</label>
                            <input type="text" className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700
                                bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0
                                focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" id="barangay"
                                placeholder="Barangay" value={barangay} name="barangay"
                                onChange={(e) => setFormData(prev => ({...prev, [e.target.name]: e.target.value})) } />
                            </div>

                        <div className="form-group mb-6 w-full">
                            <label htmlFor="street" className="form-label inline-block mb-2 text-gray-700">Street</label>
                            <input type="text" className="form-control block w-full px-3 py-1.5
                                text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300
                                rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" id="street"
                                placeholder="Street" value={street} name="street"
                                onChange={(e) => setFormData(prev => ({...prev, [e.target.name]: e.target.value})) } />
                        </div>
                        <div className="form-group mb-6 w-full flex flex-row justify-between">
                            <div className="flex flex-col" >
                                <label htmlFor="house_no" className="form-label inline-block mb-2 text-gray-700">House No</label>
                                <input type="text" className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700
                                    bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out  m-0
                                    focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" id="house_no"
                                    placeholder="House No*" value={house_no} name="house_no"
                                    onChange={(e) => setFormData(prev => ({...prev, [e.target.name]: e.target.value})) } />
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="zip_code" className="form-label inline-block mb-2 text-gray-700">Zip Code</label>
                                <input type="number" className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding
                                    border border-solid border-gray-300 rounded transition ease-in-out m-0
                                    focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" id="zip_code"
                                    placeholder="Zip Code" value={zip_code} name="zip_code"
                                    onChange={(e) => setFormData(prev => ({...prev, [e.target.name]: e.target.value})) } />
                            </div>
                        </div>
                    </div>
                    <div className='flex flex-col w-full space-y-4'>
                        <h1 className='text-xl font-medium '>Payment Option</h1>
                        <img src={visa} alt="" className='' width="300" />
                        <div className="form-group mb-6 w-full">
                            <label htmlFor="exampleInputEmail1" className="form-label inline-block mb-2 text-gray-700">Name of Card</label>
                            <input type="text" className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700
                                bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0
                                focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" id="exampleInputEmail1"
                                placeholder="Card Name" />
                        </div>
                        <div id="card-container" ref={divRef} className="p-3 bg-white"></div>
                        {
                            stripe.card_error ? <span className='text-red-500'>{stripe.card_error}</span> : null
                        }
                        {
                            stripe.processing 
                            ?
                                <button type="button" onClick={payWithCard} className={`inline-block px-6 py-2.5 bg-purple-600 text-white font-medium text-xs leading-tight uppercase 
                                rounded-full shadow-md hover:bg-purple-700 hover:shadow-lg focus:bg-purple-700 focus:shadow-lg focus:outline-none focus:ring-0 
                                active:bg-purple-800 active:shadow-lg transition duration-150 ease-in-out`}>Pay w Card</button>
                            :
                            null
                        }   
                        
                        <button type="button" onClick={() => payWithPaypal()} className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase 
                        rounded-full shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 
                        active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out">Pay w Paypal</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default CheckOut