import React from 'react'
import Navbar from '../components/Navbar'
import Header from '../components/Header'

// Home page component
const Home = () => {

  return (

    // Main home page container
    <div className='flex flex-col items-center justify-center min-h-screen bg-[url("/bg_img.png")] bg-center bg-cover'>

     {/* Navigation bar */}
     <Navbar/>

     {/* Header section */}
     <Header/>

    </div>
  )
}

// Export Home component
export default Home