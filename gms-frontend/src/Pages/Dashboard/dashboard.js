import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';

// Reusable Stat Card Component
const StatCard = ({ title, value, icon, linkTo }) => (
    <Link to={linkTo} className='w-full h-fit border-2 bg-white rounded-lg cursor-pointer shadow-md hover:shadow-xl transition-shadow'>
        <div className='h-3 rounded-t-lg bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500'></div>
        <div className='py-7 px-5 flex-col justify-center items-center w-full text-center rounded-b-lg hover:bg-slate-900 hover:text-white transition-colors'>
            {icon}
            <p className='text-xl my-2 font-semibold font-mono'>{title}</p>
            {/* Conditionally render value if it exists */}
            {value !== undefined && <p className='text-3xl font-bold'>{value}</p>}
        </div>
    </Link>
);

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalMembers: 0,
        monthlyJoined: 0,
        expiringSoon: 0,
        expired: 0,
    });
    const [loading, setLoading] = useState(true);
    const [userName, setUserName] = useState('Admin');

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await axios.get('https://gym-management-system-ixjp.onrender.com/api/members/dashboard/stats', {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                });
                setStats(response.data.stats);
                setUserName(response.data.userName);
            } catch (error) {
                console.error("Could not fetch dashboard data.", error);
                toast.error("Could not fetch live data. Displaying sample stats.");
                setStats({
                    totalMembers: 150,
                    monthlyJoined: 12,
                    expiringSoon: 8,
                    expired: 5,
                });
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) {
        return <div className="p-8 text-white w-full text-center">Loading Dashboard...</div>;
    }

    return (
        <div className='w-full md:w-3/4 text-black p-5 bg-gray-100'>
            <div className='w-full bg-slate-900 text-white rounded-lg flex p-4 justify-between items-center mb-8'>
                <h1 className="text-2xl font-bold">Welcome, {userName}!</h1>
                <img className='w-10 h-10 rounded-full border-2 border-white' src='https://static.vecteezy.com/system/resources/previews/002/265/650/large_2x/unknown-person-user-icon-for-web-vector.jpg' alt='User' />
            </div>
            <div className='grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'>
                <StatCard 
                    title="Total Members" 
                    value={stats.totalMembers} 
                    icon={<i className="fas fa-users text-blue-500 text-5xl"></i>}
                    linkTo="/member"
                />
                <StatCard 
                    title="Monthly Joined" 
                    value={stats.monthlyJoined} 
                    icon={<i className="fas fa-user-plus text-green-500 text-5xl"></i>}
                    linkTo="/specific/monthly-joined"
                />
                <StatCard 
                    title="Expiring Soon" 
                    value={stats.expiringSoon} 
                    icon={<i className="fas fa-hourglass-half text-yellow-500 text-5xl"></i>}
                    linkTo="/specific/expire-soon"
                />
                 <StatCard 
                    title="Expired Memberships" 
                    value={stats.expired} 
                    icon={<i className="fas fa-user-times text-red-500 text-5xl"></i>}
                    linkTo="/specific/expired"
                />
                {/* --- THIS IS THE NEW CARD --- */}
                <StatCard 
                    title="AI Diet Planner" 
                    icon={<i className="fas fa-utensils text-teal-500 text-5xl"></i>}
                    linkTo="/diet-planner"
                />
            </div>
            <ToastContainer />
        </div>
    )
}

export default Dashboard;