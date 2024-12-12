import Link from 'next/link';
import React, { useState,useEffect } from 'react'
import { FaRegUserCircle } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/slices/userSlice';
import { useRouter } from 'next/navigation';

const Header = () => {
  const [popupMneu, setPopUPMenu] = useState(false)
  const user = useSelector((state)=>(state.user.value));
  const dispatch = useDispatch();
  console.log(user)
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
    <>
      <div className='flex justify-between pt-4 pb-4 items-center shadow-lg'>
        <h1 className='ms-[15px]'><Link href='/home'>Header</Link></h1>
        <span className='me-[15px] cursor-pointer relative'>
          {
            user && user.data.thumbnail ? <div className='w-[40px] h-[40px] rounded-[50%]' onClick={()=>setPopUPMenu(!popupMneu) }><img src={user.path + user.data.thumbnail} className='w-[40px] h-[40px] rounded-[50%]'  /></div>
            :
            <FaRegUserCircle size={25} onClick={()=>setPopUPMenu(!popupMneu) }/>
          }
         
            <ul className='absolute popup-menu top-10 right-0 bg-red-400  w-[130px] origin-center transition-[0.5s]' style={{scale: popupMneu ? '1' : '0'}}>
              <li><h3 className='p-2 text-center font-bold'>{user ? user.data.name:""}</h3></li>
              <li><span className='p-2 mb-2'><Link href='/profile'>Profile</Link></span></li>
              <li><span className='p-2' onClick={handleLogout}>Logout</span></li>
            </ul>
        </span>
      </div>
    </>
  )
}

export default Header
