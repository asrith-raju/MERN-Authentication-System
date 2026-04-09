import React, { useContext } from 'react'
import {assets} from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

// Navbar component
const Navbar = () => {

    // Hook for page navigation
    const navigate = useNavigate()

    // Get global app state values from context
    const {userData,backendUrl,setUserData,setIsLoggedin} = useContext(AppContext)


    // Function to send email verification OTP
    const sendVerificationOtp = async () => {
      try {

        // Allow cookies in axios requests
        axios.defaults.withCredentials=true

        // Call backend API for sending OTP
        const {data} = await axios.post(backendUrl + '/api/auth/send-verify-otp')

        // If successful, navigate to verification page
        if(data.success){
          navigate('/email-verify')
          toast.success(data.message)
        }else{
          toast.error(data.message)
        }

      } catch (error) {

        // Show error message
        toast.error(error.message)
      }
    }


    // Function to logout user
    const logout = async () => {
      try {

        // Allow cookies in axios requests
        axios.defaults.withCredentials = true

        // Call logout API
        const {data} = await axios.post(backendUrl + '/api/auth/logout')

        // Update login state if successful
        data.success && setIsLoggedin(false)
        data.success && setUserData(false)

        // Redirect to home page
        navigate('/')

      } catch (error) {

        // Show error message
        toast.error(error.message)
      }
    }


  return (

    // Main navbar container
    <div className='w-full flex justify-between items-center p-4 sm:p-6 sm:px-24 absolute top-0'>

      {/* App Logo */}
      <img src={assets.logo} alt="Logo" className='w-28 sm:w-32'/>


      {/* Show user menu if logged in */}
      {userData? 

      <div className='w-8 h-8 flex items-center justify-center rounded-full bg-black text-white relative group '>

        {/* First letter of user name as avatar */}
        {userData.name[0].toUpperCase()}

        {/* Dropdown menu */}
        <div className='absolute hidden group-hover:block top-0 right-0 z-10 text-black rounded pt-10'>
             
             <ul className='list-none m-0 p-2 bg-gray-100 text-sm'>

              {/* Show verify email option if user not verified */}
              {!userData.isVerified && 
                <li onClick={sendVerificationOtp} className='py-1 px-2 hover:bg-gray-200 cursor-pointer'>
                  Verify email
                </li> 
              }
              
              {/* Logout option */}
              <li onClick={logout} className='py-1 px-2 hover:bg-gray-200 cursor-pointer pr-10'>
                Logout
              </li>

             </ul>

        </div>

      </div> : 

        // Login button if user is not logged in
        <button 
          onClick={()=>navigate('/login')} 
          className='flex items-center gap-2 border border-gray-500 rounded-full px-6 py-2 text-gray-800 hover:bg-gray-100 transition-all'
        >
          Login 
          <img src={assets.arrow_icon} alt="" />
        </button>

      }
      
    </div>
  )
}

// Export Navbar component
export default Navbar