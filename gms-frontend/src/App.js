import './App.css';
import Sidebar from './Components/Sidebar/sidebar';
import Dashboard from './Pages/Dashboard/dashboard';
import Home from './Pages/Home/home';
import Login from './Components/Login/login';
import SignUp from './Components/Signup/signUp';
import DietPlanner from './Pages/DietPlanner/DietPlanner'; // Import the new component
import { Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Member from './Pages/Member/member';
import GeneralUser from './Pages/GeneralUser/generalUser';
import MemberDetail from './Pages/MemberDetail/memberDetail';
import 'react-toastify/dist/ReactToastify.css';

function App() {
    const [isLogin, setIsLogin] = useState(false);
    const [showLogin, setShowLogin] = useState(true);

    useEffect(() => {
        let isLoggedIn = localStorage.getItem("isLogin");
        if (isLoggedIn === "true") {
            setIsLogin(true);
        } else {
            setIsLogin(false);
        }
    }, []);

    const toggleForm = () => {
        setShowLogin(!showLogin);
    }

    if (isLogin) {
        return (
            <div className="flex">
                <Sidebar />
                <Routes>
                    <Route path='/dashboard' element={<Dashboard />} />
                    <Route path='/member' element={<Member />} />
                    <Route path='/specific/:page' element={<GeneralUser />} />
                    <Route path='/member/:id' element={<MemberDetail />} />
                    <Route path='/diet-planner' element={<DietPlanner />} /> {/* Add the new route here */}
                    <Route path='*' element={<Dashboard />} />
                </Routes>
            </div>
        );
    }

    return (
        <div>
            <Home />
            <div className="absolute top-0 left-0 w-full h-full flex items-start justify-start">
                {showLogin ? <Login toggleForm={toggleForm} /> : <SignUp toggleForm={toggleForm} />}
            </div>
        </div>
    );
}

export default App;