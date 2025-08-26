import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import MemberCard from '../../Components/MemberCard/memberCard';
import { getMonthlyJoined, threeDayExpire, fourToSevenDaysExpire, expired, inActiveMembers } from './data';
import { ToastContainer } from 'react-toastify';

const GeneralUser = () => {
    const { page } = useParams(); // Get the filter type from the URL
    const navigate = useNavigate();
    const [header, setHeader] = useState("");
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            let fetchedData = [];
            let pageHeader = "";

            setLoading(true);

            switch (page) {
                case "monthly":
                    pageHeader = "Monthly Joined Members";
                    fetchedData = await getMonthlyJoined();
                    break;
                case "expire-in-3-days":
                    pageHeader = "Expiring In 3 Days";
                    fetchedData = await threeDayExpire();
                    break;
                case "expire-in-4-7-days":
                    pageHeader = "Expiring In 4-7 Days";
                    fetchedData = await fourToSevenDaysExpire();
                    break;
                case "expired":
                    pageHeader = "Expired Members";
                    fetchedData = await expired();
                    break;
                case "inactive":
                    pageHeader = "Inactive Members";
                    fetchedData = await inActiveMembers();
                    break;
                default:
                    // If the URL is unknown, go back to the dashboard
                    navigate('/dashboard');
                    return;
            }
            setHeader(pageHeader);
            setMembers(fetchedData);
            setLoading(false);
        };

        fetchData();
    }, [page, navigate]);

    return (
        <div className='p-8 w-full bg-gray-900 min-h-screen text-white'>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-bold">{header}</h1>
                <Link to={'/dashboard'} className='bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded flex items-center'>
                    &larr; Back To Dashboard
                </Link>
            </div>

            {loading ? (
                <p>Loading members...</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {members.length > 0 ? (
                        members.map(member => <MemberCard key={member._id} member={member} />)
                    ) : (
                        <p>No members found in this category.</p>
                    )}
                </div>
            )}
            <ToastContainer />
        </div>
    );
}

export default GeneralUser;