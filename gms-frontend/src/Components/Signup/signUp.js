import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';

const SignUp = ({ toggleForm }) => { // Added toggleForm prop
    const [inputField, setInputField] = useState({ gymName: "", email: "", userName: "", password: "", profilePic: "https://th.bing.com/th/id/OIP.h4NU8Jb9tA2gJLi3veRj-wHaEl?rs=1&pid=ImgDetMain" });

    const handleOnchange = (event, name) => {
        setInputField({ ...inputField, [name]: event.target.value });
    }

    const handleRegister = async () => {
        // Basic validation
        if (!inputField.gymName || !inputField.email || !inputField.userName || !inputField.password) {
            return toast.error("Please fill in all required fields.");
        }
        try {
            // UPDATED URL for production
            const response = await axios.post('https://gym-management-system-ixjp.onrender.com/api/auth/signup', {
                gymName: inputField.gymName,
                email: inputField.email,
                userName: inputField.userName,
                password: inputField.password,
                profilePic: inputField.profilePic
            });

            if (response.data) {
                toast.success("Registration Successful! Please switch to the Login page.");
            }
        } catch (error) {
            const errorMessage = error.response ? error.response.data.message : "Registration failed. Please try again.";
            toast.error(errorMessage);
        }
    }

    return (
        <div className='w-1/3 p-10 mt-10 ml-20 bg-gray-50 bg-opacity-50 h-fit max-h-[90vh] overflow-y-auto rounded-lg'>
            <div className='font-sans text-white text-center text-3xl mb-5'>Register Your Gym</div>
            
            <input type='text' value={inputField.gymName} onChange={(event) => { handleOnchange(event, "gymName") }} className='w-full my-3 p-2 rounded-lg text-black' placeholder='Enter Gym Name' />
            <input type='email' value={inputField.email} onChange={(event) => { handleOnchange(event, "email") }} className='w-full my-3 p-2 rounded-lg text-black' placeholder='Enter Email' />
            <input type='text' value={inputField.userName} onChange={(event) => { handleOnchange(event, "userName") }} className='w-full my-3 p-2 rounded-lg text-black' placeholder='Enter UserName' />
            <input type='password' value={inputField.password} onChange={(event) => { handleOnchange(event, "password") }} className='w-full my-3 p-2 rounded-lg text-black' placeholder='Enter password' />

            <div className='p-2 w-[80%] mt-5 border-2 bg-slate-800 mx-auto rounded-lg text-white text-center text-lg hover:bg-white hover:text-black font-semibold cursor-pointer' onClick={handleRegister}>Register</div>
            
            <div className='mt-4 text-center text-white'>
                Already have an account? <span onClick={toggleForm} className="font-bold cursor-pointer hover:underline">Login</span>
            </div>
            
            <ToastContainer />
        </div>
    )
}

export default SignUp;