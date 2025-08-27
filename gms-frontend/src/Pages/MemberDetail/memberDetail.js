import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import Switch from 'react-switch';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const MemberDetail = () => {
    const [member, setMember] = useState(null);
    const [loading, setLoading] = useState(true);
    const [renew, setRenew] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState("");
    const [membershipList, setMembershipList] = useState([]);
    const navigate = useNavigate();
    const { id } = useParams();

    const fetchMemberDetails = useCallback(async () => {
        try {
            // UPDATED URL for production
            const response = await axios.get(`https://gym-management-system-ixjp.onrender.com/api/members/details/${id}`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            setMember(response.data);
            // Find the ID of the current plan to set the default in the dropdown
            const currentPlan = membershipList.find(p => p.planName === response.data.plan);
            if(currentPlan) {
                setSelectedPlan(currentPlan._id);
            }
        } catch (error) {
            console.error("Could not fetch member details", error);
            toast.error("Could not fetch member details.");
            navigate('/member');
        } finally {
            setLoading(false);
        }
    }, [id, navigate, membershipList]);

    const fetchMembershipPlans = async () => {
        try {
            // UPDATED URL for production
            const response = await axios.get('https://gym-management-system-ixjp.onrender.com/api/plans/get-membership', {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            setMembershipList(response.data);
        } catch (err) {
            toast.error("Could not fetch membership plans for renewal.");
        }
    };

    useEffect(() => {
        // Fetch plans first, then member details
        const loadData = async () => {
            await fetchMembershipPlans();
            fetchMemberDetails();
        }
        loadData();
    }, [fetchMemberDetails]);

    const handleStatusToggle = async (checked) => {
        const newStatus = checked ? 'Active' : 'Inactive';
        try {
            // UPDATED URL for production
            await axios.post(`https://gym-management-system-ixjp.onrender.com/api/members/change-status/${id}`, 
                { status: newStatus },
                { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } }
            );
            setMember(prev => ({ ...prev, status: newStatus }));
            toast.success(`Member status updated to ${newStatus}`);
        } catch (error) {
            toast.error("Failed to update status.");
        }
    };

    const handleRenewMembership = async () => {
        if (!selectedPlan) {
            return toast.error("Please select a membership plan.");
        }
        try {
            // UPDATED URL for production
            await axios.put(`https://gym-management-system-ixjp.onrender.com/api/members/update-member-plan/${id}`, 
                { plan: selectedPlan },
                { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } }
            );
            toast.success("Membership renewed successfully!");
            setRenew(false);
            fetchMemberDetails();
        } catch (error) {
            toast.error("Failed to renew membership.");
        }
    };

    if (loading) {
        return <div className="p-8 text-white w-full text-center">Loading member details...</div>;
    }

    if (!member) {
        return <div className="p-8 text-white w-full text-center">Member not found.</div>;
    }

    const isExpired = new Date(member.nextBillDate) < new Date();

    return (
        <div className='p-8 w-full bg-gray-900 min-h-screen text-white'>
            <div className="mb-8">
                <Link to="/member" className="text-blue-400 hover:underline flex items-center w-fit">
                    <ArrowBackIcon /> <span className="ml-2">Back to Members List</span>
                </Link>
            </div>
            <div className='bg-gray-800 rounded-lg shadow-lg p-8'>
                <div className='flex flex-col md:flex-row gap-8'>
                    <div className='w-full md:w-1/3'>
                        <img src={member.profilePic || 'https://th.bing.com/th/id/OIP.gj6t3grz5no6UZ03uIluiwHaHa?rs=1&pid=ImgDetMain'} alt={member.name} className='w-full rounded-lg shadow-md' />
                    </div>
                    <div className='w-full md:w-2/3 text-xl'>
                        <h1 className='text-4xl font-bold mb-4'>{member.name}</h1>
                        <p className='mb-2'><span className="font-semibold text-gray-400">Email:</span> {member.email}</p>
                        <p className='mb-2'><span className="font-semibold text-gray-400">Phone:</span> {member.mobileNo}</p>
                        <p className='mb-2'><span className="font-semibold text-gray-400">Joined Date:</span> {new Date(member.joiningDate).toLocaleDateString()}</p>
                        <p className='mb-2'><span className="font-semibold text-gray-400">Next Bill Date:</span> {new Date(member.nextBillDate).toLocaleDateString()}</p>
                        <div className='mb-4 flex items-center gap-4'>
                            <span className="font-semibold text-gray-400">Status:</span>
                            <Switch onColor='#3B82F6' checked={member.status === 'Active'} onChange={handleStatusToggle} />
                            <span className={member.status === 'Active' ? 'text-green-400' : 'text-red-400'}>{member.status}</span>
                        </div>
                        {isExpired && <button onClick={() => setRenew(prev => !prev)} className={`mt-4 rounded-lg p-3 border-2 border-blue-500 text-center w-full md:w-1/2 cursor-pointer hover:bg-blue-600 transition-colors ${renew ? 'bg-blue-600' : ''}`}>Renew Membership</button>}
                        {renew && (
                            <div className="mt-4 p-4 bg-gray-700 rounded-lg">
                                <h3 className="text-lg font-semibold mb-2">Select New Plan</h3>
                                <select value={selectedPlan} onChange={(e) => setSelectedPlan(e.target.value)} className="w-full p-2 rounded bg-gray-600 border border-gray-500 mb-4">
                                    <option value="" disabled>Select a Plan</option>
                                    {membershipList.map(plan => <option key={plan._id} value={plan._id}>{plan.planName}</option>)}
                                </select>
                                <button onClick={handleRenewMembership} className="w-full bg-green-600 hover:bg-green-700 p-2 rounded">Save Renewal</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
}

export default MemberDetail;