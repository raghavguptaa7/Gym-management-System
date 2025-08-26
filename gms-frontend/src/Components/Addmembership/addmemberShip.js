import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';

const AddmemberShip = ({ handleClose }) => {
    const [inputField, setInputField] = useState({ planName: "", duration: "", price: "" });
    const [membershipList, setMembershipList] = useState([]);
    const [loading, setLoading] = useState(true);

    const handleOnChange = (event, name) => {
        setInputField({ ...inputField, [name]: event.target.value });
    };

    const fetchMembership = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:4000/api/plans/get-membership', {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            setMembershipList(response.data);
        } catch (err) {
            console.error(err);
            toast.error("Could not fetch membership plans.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMembership();
    }, []);

    const handleAddMembership = async () => {
        if (!inputField.planName || !inputField.duration || !inputField.price) {
            return toast.error("Please fill in all fields.");
        }
        try {
            // CORRECTED URL: Changed '/api/plans' to '/api/plans/add-membership'
            await axios.post('http://localhost:4000/api/plans/add-membership', inputField, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            toast.success("New membership plan added!");
            setInputField({ planName: "", duration: "", price: "" }); // Clear the form
            fetchMembership(); // Refresh the list of plans
        } catch (error) {
            const errorMessage = error.response ? error.response.data.message : "Failed to add plan.";
            toast.error(errorMessage);
        }
    };

    return (
        <div className='p-6 bg-gray-800 text-white rounded-lg'>
            <h2 className="text-2xl font-bold mb-4">Manage Membership Plans</h2>

            {/* Section to display existing plans */}
            <h3 className="text-lg font-semibold mb-2">Existing Plans</h3>
            <div className='bg-gray-700 p-4 rounded-lg mb-6 max-h-48 overflow-y-auto'>
                {loading ? <p>Loading plans...</p> : (
                    membershipList.length > 0 ? (
                        <ul className="list-disc list-inside">
                            {membershipList.map(plan => (
                                <li key={plan._id}>{plan.planName} ({plan.duration} days) - ${plan.price}</li>
                            ))}
                        </ul>
                    ) : <p>No membership plans found.</p>
                )}
            </div>

            <hr className='border-gray-600 mb-6' />

            {/* Section to add a new plan */}
            <h3 className="text-lg font-semibold mb-2">Add New Plan</h3>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                <input value={inputField.planName} onChange={(event) => handleOnChange(event, "planName")} className='p-2 rounded bg-gray-700 border border-gray-600' type='text' placeholder="Plan Name (e.g., Gold)" />
                <input value={inputField.duration} onChange={(event) => handleOnChange(event, "duration")} className='p-2 rounded bg-gray-700 border border-gray-600' type='number' placeholder="Duration (in days)" />
                <input value={inputField.price} onChange={(event) => handleOnChange(event, "price")} className='p-2 rounded bg-gray-700 border border-gray-600' type='number' placeholder="Price ($)" />
            </div>
            <div className='flex justify-end mt-6'>
                 <button onClick={handleClose} className="bg-gray-600 py-2 px-4 rounded mr-2">Close</button>
                <button onClick={handleAddMembership} className='bg-blue-600 py-2 px-4 rounded'>Add Plan</button>
            </div>
            <ToastContainer />
        </div>
    );
}

export default AddmemberShip;