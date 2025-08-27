import axios from 'axios';
import { toast } from 'react-toastify';

// Define the base URL for your API to avoid repeating it
const API_BASE_URL = 'https://gym-management-system-ixjp.onrender.com/api/members';

// Helper function to handle API requests and errors
const makeApiRequest = async (endpoint) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/${endpoint}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        return response.data;
    } catch (error) {
        const errorMessage = error.response ? error.response.data.message : `Failed to fetch data from ${endpoint}`;
        toast.error(errorMessage);
        // Return an empty array so the UI doesn't crash
        return [];
    }
};

// Fetches members who joined in the current month
const getMonthlyJoined = async () => {
    return makeApiRequest('monthly-joined');
};

// Fetches members whose memberships expire in the next 3 days
const threeDayExpire = async () => {
    return makeApiRequest('expire-in-three-days');
};

// Fetches members whose memberships expire in the next 4 to 7 days
const fourToSevenDaysExpire = async () => {
    return makeApiRequest('expire-in-four-to-seven-days');
};

// Fetches members whose memberships have already expired
const expired = async () => {
    return makeApiRequest('expired');
};

// Fetches members who are marked as inactive
const inActiveMembers = async () => {
    return makeApiRequest('inactive');
};

export { getMonthlyJoined, threeDayExpire, fourToSevenDaysExpire, expired, inActiveMembers };
