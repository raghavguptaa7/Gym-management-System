import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';

const ForgotPassword = ({ handleClose }) => {
    const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
    const [loading, setLoading] = useState(false);
    const [inputField, setInputField] = useState({ email: "", otp: "", newPassword: "" });

    const handleOnChange = (event, name) => {
        setInputField({ ...inputField, [name]: event.target.value });
    };

    // Step 1: Send OTP to the user's email
    const sendOtp = async () => {
        if (!inputField.email) {
            return toast.error("Please enter your email address.");
        }
        setLoading(true);
        try {
            await axios.post('https://gym-management-system-ixjp.onrender.com/api/auth/reset-password/sendOtp', { email: inputField.email });
            toast.success("An OTP has been sent to your email.");
            setStep(2); // Move to the OTP verification step
        } catch (error) {
            const errorMessage = error.response ? error.response.data.message : "Failed to send OTP.";
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // Step 2: Verify the OTP entered by the user
    const verifyOTP = async () => {
        if (!inputField.otp) {
            return toast.error("Please enter the OTP.");
        }
        setLoading(true);
        try {
            await axios.post('https://gym-management-system-ixjp.onrender.com/api/auth/reset-password/checkOtp', { email: inputField.email, otp: inputField.otp });
            toast.success("OTP verified successfully. Please set a new password.");
            setStep(3); // Move to the new password step
        } catch (error) {
            const errorMessage = error.response ? error.response.data.message : "Invalid OTP.";
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // Step 3: Change the user's password
    const changePassword = async () => {
        if (!inputField.newPassword) {
            return toast.error("Please enter a new password.");
        }
        setLoading(true);
        try {
            await axios.post('https://gym-management-system-ixjp.onrender.com/api/auth/reset-password', { 
                email: inputField.email, 
                otp: inputField.otp, 
                newPassword: inputField.newPassword 
            });
            toast.success("Password has been reset successfully! You can now log in.");
            setTimeout(() => {
                handleClose(); // Close the modal after a short delay
            }, 2000);
        } catch (error) {
            const errorMessage = error.response ? error.response.data.message : "Failed to reset password.";
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = () => {
        if (step === 1) {
            sendOtp();
        } else if (step === 2) {
            verifyOTP();
        } else {
            changePassword();
        }
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return <input value={inputField.email} onChange={(e) => handleOnChange(e, "email")} type="email" placeholder="Enter your registered email" className="w-full p-2 rounded bg-gray-700 border border-gray-600" />;
            case 2:
                return <input value={inputField.otp} onChange={(e) => handleOnChange(e, "otp")} type="text" placeholder="Enter OTP from your email" className="w-full p-2 rounded bg-gray-700 border border-gray-600" />;
            case 3:
                return <input value={inputField.newPassword} onChange={(e) => handleOnChange(e, "newPassword")} type="password" placeholder="Enter your new password" className="w-full p-2 rounded bg-gray-700 border border-gray-600" />;
            default:
                return null;
        }
    };

    const getButtonText = () => {
        switch (step) {
            case 1: return "Send OTP";
            case 2: return "Verify OTP";
            case 3: return "Reset Password";
            default: return "Submit";
        }
    };

    return (
        <div className='p-6 bg-gray-800 text-white rounded-lg'>
            <h2 className="text-2xl font-bold mb-4">Reset Your Password</h2>
            <div className="mb-4">
                {renderStep()}
            </div>
            <button 
                onClick={handleSubmit} 
                disabled={loading}
                className='w-full bg-blue-600 py-2 px-4 rounded disabled:opacity-50'
            >
                {loading ? 'Processing...' : getButtonText()}
            </button>
            <ToastContainer />
        </div>
    );
}

export default ForgotPassword;
