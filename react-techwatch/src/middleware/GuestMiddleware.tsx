import React from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAppSelector } from '../feature/index';

type Props = {}

function GuestMiddleware(props: Props) {
    const location = useLocation();
    const {token, user} = useAppSelector(state => state.user);

    if(token === null && user === null) { 
        return <Outlet /> 
    } else {
        console.log('here')
        return <Navigate to='/' state={{ from: location }} replace />
    }
}

export default GuestMiddleware