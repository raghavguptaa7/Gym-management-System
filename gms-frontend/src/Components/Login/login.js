import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';

const Login = ({ toggleForm }) => {
    const [loginField, setLoginField] = useState({ "userName": "", "password": "" });
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            // UPDATED URL for production
            const response = await axios.post('https://gym-management-system-ixjp.onrender.com/api/auth/login', {
                userName: loginField.userName,
                password: loginField.password
            });

            if (response.data) {
                toast.success("Login Successful!");

                // Store session data in localStorage
                localStorage.setItem("isLogin", "true");
                if (response.data.token) {
                    localStorage.setItem("token", response.data.token);
                }
                if (response.data.gymName) {
                    localStorage.setItem("gymName", response.data.gymName);
                }

                // Force a reload to update the app's state and redirect
                window.location.href = '/dashboard';
            }
        } catch (error) {
            const errorMessage = error.response ? error.response.data.message : "Login failed. Please check your credentials.";
            toast.error(errorMessage);
        }
    };

    const handleOnChange = (event, name) => {
        setLoginField({ ...loginField, [name]: event.target.value });
    }

    return (
        <div className='w-full max-w-md p-8 mt-20 ml-20 bg-gray-50 bg-opacity-50 h-fit rounded-lg'>
            <div className='font-sans text-white text-center text-3xl mb-10'>Login</div>

            <input value={loginField.userName} onChange={(event) => { handleOnChange(event, "userName") }} type='text' className='w-full my-5 p-3 rounded-lg text-black' placeholder='Enter userName' />
            <input value={loginField.password} onChange={(event) => { handleOnChange(event, "password") }} type='password' className='w-full mb-5 p-3 rounded-lg text-black' placeholder='Enter password' />

            <div className='p-3 w-[80%] border-2 bg-slate-800 mx-auto rounded-lg text-white text-center text-lg hover:bg-white hover:text-black font-semibold cursor-pointer' onClick={handleLogin}>Login</div>
            
            <div className='mt-4 text-center text-white'>
                Don't have an account? <span onClick={toggleForm} className="font-bold cursor-pointer hover:underline">Sign Up</span>
            </div>
            
            <ToastContainer />
        </div>
    )
}

export default Login;