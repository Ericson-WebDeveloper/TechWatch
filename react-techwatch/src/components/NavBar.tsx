import React, { useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../feature';
import { RESTART_CART, SET_TOTALPRICE, SET_TOTALQTY } from '../feature/cart/cartSlice';
import { SET_SIGN_OUT } from '../feature/user/userSlice';
import { useLogoutUserMutation } from '../service/auth';
import BarNav from './BarNav';

type NavBarProps = {}

const hw = {
    height: '25px',
    width: '25px',
}

const NavBar = (props: NavBarProps) => {
    let navigate = useNavigate();
    const location = useLocation();
    const {user, token} = useAppSelector(state => state.user);
    const {cart, totalQty} = useAppSelector(state => state.cart);
    const dispatch = useAppDispatch();
    const [logoutUser, {isError, isLoading, isSuccess, error}] = useLogoutUserMutation();

    const signOutUser = async () => {
        await logoutUser();
    }   

    const resetCart = () => {
        dispatch(RESTART_CART());
        if (location.pathname === '/checkout-shop') navigate('/');
    }

    useEffect(() => {
        if(cart) {
            dispatch(SET_TOTALQTY());
            dispatch(SET_TOTALPRICE());
        }
    }, [cart, dispatch]);

    useEffect(() => {
        if(isSuccess) {
            dispatch(SET_SIGN_OUT());
            window.location.reload();
            navigate(`/`);
        }
        
    },[dispatch, isSuccess, navigate])

  return (
    <>
    <BarNav />
        <nav className="relative w-full flex flex-wrap items-center justify-between py-3 bg-[#11998E] 
        text-gray-200 shadow-lg navbar navbar-expand-lg navbar-light">
            <div className="container-fluid w-full flex flex-wrap items-center justify-between px-6">
                <button className="navbar-toggler text-gray-200 border-0 hover:shadow-none hover:no-underline py-2 px-2.5 bg-transparent 
                    focus:outline-none focus:ring-0 focus:shadow-none focus:no-underline"type="button" data-bs-toggle="collapse" 
                    data-bs-target="#navbarSupportedContent1" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="bars" className="w-6" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                        <path fill="currentColor" d="M16 132h416c8.837 0 16-7.163 16-16V76c0-8.837-7.163-16-16-16H16C7.163 60 
                        0 67.163 0 76v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 
                        7.163-16 16v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16z"
                        ></path>
                    </svg>
                </button>
                <Link className="text-2xl text-white pr-2 font-semibold" to="/">TechWatch</Link>
                {/* <!-- Left links --> */}
                    <ul className="navbar-nav flex flex-col pl-0 list-style-none mr-auto">
                        <li className="nav-item p-2">
                            <Link className="nav-link text-white" to="/">Home</Link>
                        </li>
                        {
                            !user && !token 
                            ?
                            <>
                                <li className="nav-item p-2 mt-2">
                                    <Link className="nav-link text-white opacity-60 hover:opacity-80 focus:opacity-80 p-0" to="/signin">Sign In</Link>
                                </li>
                                <li className="nav-item p-2 mt-2">
                                    <Link className="nav-link text-white opacity-60 hover:opacity-80 focus:opacity-80 p-0" to="/signup">Sign Up</Link>
                                </li>
                            </>
                            :
                            null
                        }
                       
                    </ul>
                <div className="collapse navbar-collapse flex-grow items-center" id="navbarSupportedContent1">

                {/* <!-- Left links --> */}
                </div>
                {/* <!-- Collapsible wrapper --> */}

                {/* <!-- Right elements --> */}
                <div className="flex items-center relative">
                {/* <!-- Icon --> */}
  
                <div className="dropdown relative">
                    <Link to="/" className="text-white opacity-60 hover:opacity-80 focus:opacity-80 mr-4 dropdown-toggle hidden-arrow flex items-center"
                     id="dropdownMenuButton1" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                        <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="shopping-cart"
                        className="w-4" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                        <path fill="currentColor"
                            d="M528.12 301.319l47.273-208C578.806 78.301 567.391 64 551.99 64H159.208l-9.166-44.81C147.758 8.021 137.93 0 126.529 0H24C10.745 0 0 10.745 0 24v16c0 13.255 10.745 24 24 24h69.883l70.248 343.435C147.325 417.1 136 435.222 136 456c0 30.928 25.072 56 56 56s56-25.072 56-56c0-15.674-6.447-29.835-16.824-40h209.647C430.447 426.165 424 440.326 424 456c0 30.928 25.072 56 56 56s56-25.072 56-56c0-22.172-12.888-41.332-31.579-50.405l5.517-24.276c3.413-15.018-8.002-29.319-23.403-29.319H218.117l-6.545-32h293.145c11.206 0 20.92-7.754 23.403-18.681z"
                        ></path>
                        </svg>
                        {
                            cart ? 
                            <span className="text-white bg-red-700 absolute rounded-full text-xs -mt-2.5 ml-2 py-0 px-1.5">
                                {totalQty === 0 ? '' : totalQty}</span>
                            :
                            null
                        }
                        
                    </Link>
                    <ul className="dropdown-menu min-w-max absolute bg-white text-base z-50 float-left py-2 list-none text-left rounded-lg shadow-lg mt-1 hidden m-0 bg-clip-padding border-none left-auto right-0"
                    aria-labelledby="dropdownMenuButton1">
                        <li>
                            <Link to="/cart" className="dropdown-item text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent 
                            text-gray-700 hover:bg-gray-100" >Go to Cart</Link>
                        </li>
                        {
                            cart ? 
                            <li>
                                <span onClick={resetCart} className="dropdown-item text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent 
                                text-gray-700 hover:bg-gray-100 cursor-pointer">Clear Cart</span>
                            </li>
                            :
                            null
                        }
                        
                        {/* <li>
                            <Link className="dropdown-item text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-gray-700 hover:bg-gray-100"
                            to="/">Something else here</Link>
                        </li> */}
                    </ul>
                </div>
                {
                    !user && !token 
                    ?
                    null
                    :
                    <>
                        <div className="dropdown relative">
                            <Link className="dropdown-toggle flex items-center hidden-arrow"
                                to="/" id="dropdownMenuButton2" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                <img src="https://mdbootstrap.com/img/new/avatars/2.jpg" className="rounded-full" style={ hw } alt="" loading="lazy" />
                            </Link>
                            <ul className="dropdown-menu min-w-max absolute bg-white text-base z-50 float-left py-2 list-none text-left rounded-lg 
                        shadow-lg mt-1 hidden m-0 bg-clip-padding border-none left-auto right-0" aria-labelledby="dropdownMenuButton2">
                                <li>
                                    <Link className="dropdown-item text-sm py-2 px-4 font-normal block w-full 
                                    whitespace-nowrap bg-transparent text-gray-700 hover:bg-gray-100" to="/user/profile">Profile</Link>
                                </li>
                                <li>
                                    <span onClick={signOutUser} className="dropdown-item text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent
                                    text-gray-700 hover:bg-gray-100 cursor-pointer">Sign Out</span>
                                </li>
                                <li>
                                    <Link className="dropdown-item text-sm py-2 px-4 font-normal block w-full whitespace-nowrap 
                                    bg-transparent text-gray-700 hover:bg-gray-100" to="/">Something else here</Link>
                                </li>
                            </ul>
                        </div>
                    </>
                }
                    
                </div>
                {/* <!-- Right elements --> */}
            </div>
        </nav>
    </>
  )
}

export default NavBar