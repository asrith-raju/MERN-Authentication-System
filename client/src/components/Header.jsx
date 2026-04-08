import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext'

// Header component for home/dashboard welcome section
const Header = () => {

    // Get user data from global context
    const {userData} = useContext(AppContext)
    
  return (
    // Main header container
    <div className='flex flex-col items-center mt-20 px-4 text-center text-gray-800'>

      {/* User profile image */}
      <img src={assets.header_img} alt="" className='w-36 h-36 rounded-full mb-6 '/>

      {/* Greeting message with username */}
      <h1 className='flex items-center gap-2 text-xl sm:text-3xl font-medium mb-2'>
        Hey {userData?userData.name :'Developer'}!
        <img className='w-8 aspect-square ' src={assets.hand_wave} alt="" />
      </h1>

      {/* Welcome heading */}
      <h2 className='text-3xl sm:text-5xl font-semibold mb-4'>
        Welcome to our app
      </h2>

      {/* Description text */}
      <p className='mb-8 max-w-md'>
        Let's start with a quick product tour and we will have you up and running in no time!
      </p>

      {/* Get started button */}
      <button className='border border-gray-500 rounded-full px-8 py-2.5 hover:bg-gray-100 transition-all'>
        Get Started
      </button>

    </div>
  )
}

// Export Header component
export default Header