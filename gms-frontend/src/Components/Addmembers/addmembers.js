import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';

const Addmembers = ({ closeModal, refreshMembers }) => {
    const [inputField, setInputField] = useState({
        name: "",
        mobileNo: "",
        address: "",
        membership: "",
        joiningDate: new Date().toISOString().split('T')[0]
    });
    const [membershipList, setMembershipList] = useState([]);

    const handleOnChange = (event, name) => {
        setInputField({ ...inputField, [name]: event.target.value });
    };

    const fetchMembership = async () => {
        try {
            const response = await axios.get('http://localhost:4000/api/plans/get-membership', {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            setMembershipList(response.data);
            if (response.data.length > 0) {
                setInputField(prev => ({ ...prev, membership: response.data[0]._id }));
            }
        } catch (err) {
            console.error(err);
            toast.error("Could not fetch membership plans.");
        }
    };

    useEffect(() => {
        fetchMembership();
    }, []);

    const handleRegisterButton = async () => {
        if (!inputField.name || !inputField.mobileNo || !inputField.address || !inputField.membership) {
            return toast.error("Please fill all required fields.");
        }
        try {
            await axios.post('http://localhost:4000/api/members/register-member', inputField, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            toast.success("Member registered successfully!");
            refreshMembers();
            closeModal();
        } catch (error) {
            const errorMessage = error.response ? error.response.data.message : "Registration failed.";
            toast.error(errorMessage);
        }
    };

    return (
        <div className='p-6 bg-gray-800 text-white rounded-lg'>
            <h2 className="text-2xl font-bold mb-6">Add New Member</h2>
            <div className='grid gap-5 grid-cols-1 md:grid-cols-2 text-lg'>
                <input value={inputField.name} onChange={(event) => { handleOnChange(event, "name") }} placeholder='Name of the Joinee' type='text' className='w-full p-2 rounded bg-gray-700 border border-gray-600' />
                <input value={inputField.mobileNo} onChange={(event) => { handleOnChange(event, "mobileNo") }} placeholder='Mobile Number' type='tel' className='w-full p-2 rounded bg-gray-700 border border-gray-600' />
                <textarea value={inputField.address} onChange={(event) => { handleOnChange(event, "address") }} placeholder='Address' className='w-full p-2 rounded bg-gray-700 border border-gray-600 md:col-span-2' rows="2"></textarea>
                <input value={inputField.joiningDate} onChange={(event) => { handleOnChange(event, "joiningDate") }} type='date' className='w-full p-2 rounded bg-gray-700 border border-gray-600' />
                
                <select value={inputField.membership} onChange={(event) => handleOnChange(event, "membership")} className='w-full p-2 rounded bg-gray-700 border border-gray-600'>
                    <option value="" disabled>Select a Plan</option>
                    {membershipList.map((item) => (
                        <option key={item._id} value={item._id}>{item.planName} ({item.duration} days)</option>
                    ))}
                </select>
            </div>
            <div className='flex justify-end mt-6'>
                <button onClick={closeModal} className="bg-gray-600 py-2 px-4 rounded mr-2">Cancel</button>
                <button onClick={handleRegisterButton} className='bg-blue-600 py-2 px-4 rounded'>Register</button>
            </div>
            <ToastContainer />
        </div>
    )
}

export default Addmembers;