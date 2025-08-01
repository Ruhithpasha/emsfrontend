import React, { useState } from 'react'
import { setLocalStorage } from '../../utils/LocalStorage'

const Header = () => {

// const [userName, setuserName] = useState('')

// if(!data){
//   setuserName('Admin')

// }else{
//   setuserName(data.firstName)
// }


const logOutUser= ()=>{
 localStorage.setItem("loggedInUser",'')
//  console.log(loggedInUser)
 window.location.reload();
}


  return (
    <div className='flex items-end justify-between'>
        <h1 className='text-2xl font-medium'>Hello, <br /> <span className='text-3xl font-semibold'>pasha bhai👋 </span></h1>
        <button onClick={logOutUser} className='text-lg text-white font-medium bg-red-500 px-5 py-2 rounded-md'>Log Out</button>
    </div>
  )
}

export default Header