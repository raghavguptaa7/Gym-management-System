import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const DietPlanner = () => {
    const [formData, setFormData] = useState({
        age: '',
        weight: '',
        height: '',
        goal: 'weight_loss',
        diet_preference: 'vegetarian',
    });
    const [dietPlan, setDietPlan] = useState('');
    const [loading, setLoading] = useState(false);

    const handleOnChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.age || !formData.weight || !formData.height) {
            return toast.error("Please fill in all the fields.");
        }
        setLoading(true);
        setDietPlan(''); // Clear previous diet plan
        try {
            // This is the backend endpoint we will create next
            const response = await axios.post('https://gym-management-system-ixjp.onrender.com/api/diet/generate', formData, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            setDietPlan(response.data.dietPlan);
            toast.success("Diet plan generated successfully!");
        } catch (error) {
            const errorMessage = error.response ? error.response.data.message : "Failed to generate diet plan.";
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 w-full bg-gray-900 min-h-screen text-white">
            <div className="mb-8">
                <Link to="/dashboard" className="text-blue-400 hover:underline flex items-center w-fit">
                    <ArrowBackIcon /> <span className="ml-2">Back to Dashboard</span>
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Form Section */}
                <div className="md:col-span-1 bg-gray-800 p-6 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-bold mb-6">Create a Diet Plan</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block mb-1">Age</label>
                            <input type="number" name="age" value={formData.age} onChange={handleOnChange} className="w-full p-2 rounded bg-gray-700 border border-gray-600" />
                        </div>
                        <div className="mb-4">
                            <label className="block mb-1">Weight (kg)</label>
                            <input type="number" name="weight" value={formData.weight} onChange={handleOnChange} className="w-full p-2 rounded bg-gray-700 border border-gray-600" />
                        </div>
                        <div className="mb-4">
                            <label className="block mb-1">Height (cm)</label>
                            <input type="number" name="height" value={formData.height} onChange={handleOnChange} className="w-full p-2 rounded bg-gray-700 border border-gray-600" />
                        </div>
                        <div className="mb-4">
                            <label className="block mb-1">Fitness Goal</label>
                            <select name="goal" value={formData.goal} onChange={handleOnChange} className="w-full p-2 rounded bg-gray-700 border border-gray-600">
                                <option value="weight_loss">Weight Loss</option>
                                <option value="muscle_gain">Muscle Gain</option>
                                <option value="maintenance">Maintenance</option>
                            </select>
                        </div>
                        <div className="mb-6">
                            <label className="block mb-1">Dietary Preference</label>
                            <select name="diet_preference" value={formData.diet_preference} onChange={handleOnChange} className="w-full p-2 rounded bg-gray-700 border border-gray-600">
                                <option value="vegetarian">Vegetarian</option>
                                <option value="non_vegetarian">Non-Vegetarian</option>
                                <option value="vegan">Vegan</option>
                            </select>
                        </div>
                        <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50">
                            {loading ? 'Generating...' : 'Generate Diet Plan'}
                        </button>
                    </form>
                </div>

                {/* Display Section */}
                <div className="md:col-span-2 bg-gray-800 p-6 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-bold mb-6">Generated Diet Plan</h2>
                    <div className="bg-gray-700 p-4 rounded-lg min-h-[400px] whitespace-pre-wrap font-mono">
                        {loading && <p>Generating your personalized diet plan, please wait...</p>}
                        {dietPlan ? dietPlan : <p>Your generated diet plan will appear here.</p>}
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
};

export default DietPlanner;
