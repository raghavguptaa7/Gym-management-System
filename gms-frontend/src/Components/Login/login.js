import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';

const Login = ({ toggleForm }) => { // Added toggleForm prop
    const [loginField, setLoginField] = useState({ "userName": "", "password": "" });
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            // Send the username and password to your backend server
            const response = await axios.post('http://localhost:4000/api/auth/login', {
                userName: loginField.userName,
                password: loginField.password
            });

            // If the server responds with data, the login was successful
            if (response.data) {
                toast.success("Login Successful!");

                // 1. Store the login state so the app remembers you
                localStorage.setItem("isLogin", "true");
                
                // Optional: Store the auth token if the backend sends one
                if (response.data.token) {
                    localStorage.setItem("token", response.data.token);
                }

                // 2. Force a window reload to update the app state and redirect
                window.location.href = '/dashboard';
            }
        } catch (error) {
            // If there's an error, show a popup message
            const errorMessage = error.response ? error.response.data.message : "Login failed. Please check your credentials.";
            toast.error(errorMessage);
        }
    };

    const handleOnChange = (event, name) => {
        setLoginField({ ...loginField, [name]: event.target.value });
    }

    return (
        <div className='w-1/3 p-10 mt-20 ml-20 bg-gray-50 bg-opacity-50 h-fit rounded-lg'>
            <div className='font-sans text-white text-center text-3xl mb-10'>Login</div>

            <input value={loginField.userName} onChange={(event) => { handleOnChange(event, "userName") }} type='text' className='w-full my-5 p-2 rounded-lg' placeholder='Enter userName' />
            <input value={loginField.password} onChange={(event) => { handleOnChange(event, "password") }} type='password' className='w-full mb-5 p-2 rounded-lg' placeholder='Enter password' />

            <div className='p-2 w-[80%] border-2 bg-slate-800 mx-auto rounded-lg text-white text-center text-lg hover:bg-white hover:text-black font-semibold cursor-pointer' onClick={handleLogin}>Login</div>
            
            <div className='mt-4 text-center text-white'>
                Don't have an account? <span onClick={toggleForm} className="font-bold cursor-pointer hover:underline">Sign Up</span>
            </div>
            
            <ToastContainer />
        </div>
    )
}

export default Login;