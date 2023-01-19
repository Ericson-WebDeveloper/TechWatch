import React from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAppSelector } from '../feature/index';

type Props = {}

const ProtechMiddleware = (props: Props) => {
    const location = useLocation();
    const {token, user} = useAppSelector(state => state.user);

    if(user && token) { 
        return <Outlet /> 
    } else {
        return <Navigate to='/signin' state={{ from: location }} replace />
    }
}

export default ProtechMiddleware