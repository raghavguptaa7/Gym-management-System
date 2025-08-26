import React from 'react';

const Home = () => {
  return (
    // This div acts as a container for the background image
    <div className='w-full h-screen fixed top-0 left-0 -z-10'>
      {/* The background image with cover and center properties */}
      <div 
        className='w-full h-full bg-cover bg-center' 
        style={{ backgroundImage: `url("https://images.unsplash.com/photo-1571902943202-507ec2618e8f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1375&q=80")` }}
      >
        {/* A dark overlay to make text on top more readable */}
        <div className="w-full h-full bg-black bg-opacity-50"></div>
      </div>

      {/* The header is now part of the overlay content, but App.js will place the forms */}
      <div className='absolute top-0 left-0 w-full text-white p-5 font-semibold text-xl bg-black bg-opacity-20'>
        Welcome To Gym Management System 
      </div>
    </div>
  );
}

export default Home;