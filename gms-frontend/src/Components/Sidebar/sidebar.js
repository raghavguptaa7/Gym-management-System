import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import GroupIcon from '@mui/icons-material/Group';
import LogoutIcon from '@mui/icons-material/Logout';

const Sidebar = () => {
    const [greeting, setGreeting] = useState("");
    const navigate = useNavigate();

    // Sets a greeting based on the time of day
    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) {
            setGreeting("Good Morning");
        } else if (hour < 18) {
            setGreeting("Good Afternoon");
        } else {
            setGreeting("Good Evening");
        }
    }, []);

    const handleLogout = () => {
        // Clear all user data from local storage
        localStorage.clear();
        // Navigate to the home/login page
        navigate('/');
        // Force a reload to ensure all application state is cleared
        window.location.reload();
    };

    // This is the style that will be applied to the active NavLink
    const activeLinkStyle = {
        backgroundColor: '#4C51BF', // Indigo color for active link
        color: 'white',
        fontWeight: 'bold',
    };

    return (
        <div className='w-64 h-screen bg-gray-800 text-white flex flex-col shadow-lg'>
            {/* Sidebar Header */}
            <div className='p-5 text-center border-b border-gray-700'>
                <h1 className='text-2xl font-bold'>{localStorage.getItem('gymName') || 'Gym Admin'}</h1>
                <p className='text-sm text-gray-400 mt-1'>{greeting}</p>
            </div>

            {/* Navigation Links */}
            <nav className='flex-grow mt-5'>
                <NavLink 
                    to='/dashboard' 
                    className='flex items-center gap-4 py-3 px-5 rounded-md mx-2 my-1 transition-colors hover:bg-gray-700'
                    style={({ isActive }) => isActive ? activeLinkStyle : undefined}
                >
                    <HomeIcon />
                    <span>Dashboard</span>
                </NavLink>

                <NavLink 
                    to='/member' 
                    className='flex items-center gap-4 py-3 px-5 rounded-md mx-2 my-1 transition-colors hover:bg-gray-700'
                    style={({ isActive }) => isActive ? activeLinkStyle : undefined}
                >
                    <GroupIcon />
                    <span>Members</span>
                </NavLink>
                
                {/* You can add more links here in the future */}
            </nav>

            {/* Logout Button */}
            <div className='p-5 border-t border-gray-700'>
                <button 
                    onClick={handleLogout} 
                    className='flex items-center justify-center gap-4 w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors'
                >
                    <LogoutIcon />
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );
}

export default Sidebar;