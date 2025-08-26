import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';

import Modal from '../../Components/Modal/modal';
import MemberCard from '../../Components/MemberCard/memberCard';
import Addmembers from '../../Components/Addmembers/addmembers';
import AddmemberShip from '../../Components/Addmembership/addmemberShip'; // Import the membership component

const Member = () => {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
    const [isMembershipModalOpen, setIsMembershipModalOpen] = useState(false); // State for the new modal

    // State for pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalMembers, setTotalMembers] = useState(0);
    const limit = 8; // Members per page

    const fetchMembers = useCallback(async (page = 1, searchTerm = "") => {
        setLoading(true);
        try {
            const url = searchTerm 
                ? `http://localhost:4000/api/members/search?q=${searchTerm}&page=${page}&limit=${limit}`
                : `http://localhost:4000/api/members/all-member?page=${page}&limit=${limit}`;

            const response = await axios.get(url, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            
            setMembers(response.data.members);
            setTotalMembers(response.data.pagination.total);
            setTotalPages(response.data.pagination.pages);
            setCurrentPage(response.data.pagination.page);

        } catch (error) {
            console.error("Could not fetch members", error);
            toast.error("Could not fetch members list.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchMembers(1); // Fetch the first page on component load
    }, [fetchMembers]);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchMembers(1, search);
    };

    const handlePrev = () => {
        if (currentPage > 1) {
            fetchMembers(currentPage - 1, search);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            fetchMembers(currentPage + 1, search);
        }
    };

    // Handlers for the "Add Member" modal
    const handleOpenAddMemberModal = () => setIsAddMemberModalOpen(true);
    const handleCloseAddMemberModal = () => setIsAddMemberModalOpen(false);

    // Handlers for the "Manage Plans" modal
    const handleOpenMembershipModal = () => setIsMembershipModalOpen(true);
    const handleCloseMembershipModal = () => setIsMembershipModalOpen(false);

    return (
        <div className='p-8 w-full bg-gray-900 min-h-screen text-white'>
            {/* Header and Action Buttons */}
            <div className='flex flex-col md:flex-row justify-between items-center mb-8 gap-4'>
                <h1 className="text-4xl font-bold">Members</h1>
                <div className="flex gap-4">
                    <button onClick={handleOpenMembershipModal} className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded w-full md:w-auto">
                        Manage Plans
                    </button>
                    <button onClick={handleOpenAddMemberModal} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full md:w-auto">
                        + Add Member
                    </button>
                </div>
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className='mb-8 flex gap-2'>
                <input 
                    type='text' 
                    value={search} 
                    onChange={(e) => setSearch(e.target.value)} 
                    className='border-2 border-gray-600 bg-gray-800 w-full md:w-1/2 p-2 rounded-lg text-white' 
                    placeholder='Search By Name or Mobile No' 
                />
                <button type="submit" className='bg-slate-700 p-3 border-2 border-gray-600 text-white rounded-lg hover:bg-slate-600'>Search</button>
            </form>

            {/* Members List */}
            {loading ? (
                <p>Loading members...</p>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {members.length > 0 ? (
                            members.map(member => <MemberCard key={member._id} member={member} />)
                        ) : (
                            <p>No members found. Add one to get started!</p>
                        )}
                    </div>

                    {/* Pagination Controls */}
                    <div className='mt-8 flex justify-between items-center'>
                        <span>Page {currentPage} of {totalPages} ({totalMembers} total members)</span>
                        <div className='flex gap-2'>
                            <button onClick={handlePrev} disabled={currentPage === 1} className="bg-gray-700 p-2 rounded disabled:opacity-50">Previous</button>
                            <button onClick={handleNext} disabled={currentPage === totalPages} className="bg-gray-700 p-2 rounded disabled:opacity-50">Next</button>
                        </div>
                    </div>
                </>
            )}

            {/* Modal for Adding a New Member */}
            {isAddMemberModalOpen && (
                <Modal 
                    header={"Add New Member"} 
                    handleClose={handleCloseAddMemberModal} 
                    content={<Addmembers closeModal={handleCloseAddMemberModal} refreshMembers={() => fetchMembers(currentPage, search)} />} 
                />
            )}

            {/* Modal for Managing Membership Plans */}
            {isMembershipModalOpen && (
                <Modal 
                    header={"Manage Membership Plans"} 
                    handleClose={handleCloseMembershipModal} 
                    content={<AddmemberShip handleClose={handleCloseMembershipModal} />} 
                />
            )}
            <ToastContainer />
        </div>
    );
}

export default Member;