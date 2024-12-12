"use client"

import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/slices/userSlice';
import Header from '../common/Header';

const page = () => {

  
  const user = useSelector((state)=>(state.user.value));

  const dispatch = useDispatch();
  const nav=useRouter()

  const handleLogout=(e)=>{
    e.preventDefault()
    //localStorage.removeItem('user-data')
    dispatch(logout())
    nav.push('/')
  }
  const ifLogins=()=>{
    const cookieData=localStorage.getItem('user-data')
    if(!cookieData) nav.push('/')
 }
 useEffect(()=>{
   ifLogins()
 },[])
  return (
    <div>
           <Header />
            
            {user?user.data.name:""}
            <button onClick={handleLogout}>Logout</button>
    </div>
  )
}

export default page
