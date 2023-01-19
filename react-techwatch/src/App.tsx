import React from 'react';
import NavBar from './components/NavBar';
import {
  Routes,
  Route,
} from "react-router-dom";
import Index from './pages/Index';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Footer from './components/Footer';
import Cart from './pages/Cart';
import CheckOut from './pages/CheckOut';
import ForGotPass from './pages/ForGotPass';
import ResetPass from './pages/ResetPass';
import Profile from './pages/user/Profile';
import Billing from './pages/user/Billing';
import Orders from './pages/user/Orders';
import OderView from './pages/user/OderView';
import OrderTracking from './pages/user/OrderTracking';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProtechMiddleware from './middleware/ProtechMiddleware';
import GuestMiddleware from './middleware/GuestMiddleware';
import SignInCallBack from './pages/SignInCallBack';
import PaymentProcess from './pages/paypal/PaymentProcess';
// import CardPaymentProcess from './pages/stripe/PaymentProcess';
import PaymentDone from './pages/paypal/PaymentDone';
import CardPaymentDone from './pages/stripe/PaymentDone';
import CardPaymentProcess from './pages/stripe/PaymentProcess';

function App() {
  return (
    <div className="flex max-h-max w-full">
      <div className='flex flex-col h-[100vh] w-full'>
          <NavBar />
        <div className='container mx-auto'>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route element={<GuestMiddleware />}>
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/forgot-password" element={<ForGotPass />} />
              <Route path="/reset-password" element={<ResetPass />} />
              <Route path="/signin/:provider/callback" element={<SignInCallBack />} />
            </Route>

            <Route path="/cart" element={<Cart />} />
            <Route element={<ProtechMiddleware />}>
              <Route path="/checkout-shop" element={<CheckOut />} />
              <Route path="/user/profile" element={<Profile />} />
              <Route path="/user/profile-billing/address" element={<Billing />} />
              <Route path="/user/orders" element={<Orders />} />
              <Route path="/user/order/:uuid" element={<OderView />} />
              <Route path="/user/order-tracking/:uuid" element={<OrderTracking />} />
              <Route path="/payment-done" element={<PaymentProcess />} />
              <Route path="/payment/:status/page" element={<PaymentDone />} />
              <Route path="/payment-done/card" element={<CardPaymentProcess />} />
              <Route path="/payment/:status/card" element={<CardPaymentDone />} />
              {/* <Route path="/order-track/:uuid" element={<OrderTracking />} /> */}
              
            </Route>
          </Routes>
        </div>
        <br />
        <Footer/>
        <ToastContainer 
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark" />
      </div>
    </div>
  );
}

export default App;
