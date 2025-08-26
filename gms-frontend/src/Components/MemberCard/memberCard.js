import React from 'react';
import { Link } from 'react-router-dom';

const MemberCard = ({ member }) => {
    // CORRECTED: Check the 'status' string property instead of 'isActive'
    const statusClass = member.status === 'Active' ? 'bg-green-500' : 'bg-red-500';
    const statusText = member.status === 'Active' ? 'Active' : 'Inactive';

    return (
        <div className="bg-gray-800 rounded-lg shadow-lg p-5 flex flex-col justify-between transition-transform transform hover:-translate-y-1">
            <div>
                <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center">
                        <img className='w-12 h-12 rounded-full mr-4 border-2 border-gray-600' src={member.profilePic || 'https://th.bing.com/th/id/OIP.gj6t3grz5no6UZ03uIluiwHaHa?rs=1&pid=ImgDetMain'} alt={`${member.name}'s profile`} />
                        <div>
                            <h3 className="text-xl font-bold text-white">{member.name}</h3>
                            <p className="text-gray-400 text-sm">{member.mobileNo}</p>
                        </div>
                    </div>
                    <span className={`px-2 py-1 text-xs font-semibold text-white rounded-full ${statusClass}`}>
                        {statusText}
                    </span>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-700">
                    <p className="text-sm text-gray-300">
                        <span className="font-semibold">Plan:</span> <span className="capitalize">{member.plan}</span>
                    </p>
                    <p className="text-sm text-gray-300 mt-1">
                        <span className="font-semibold">Next Bill Date:</span> {new Date(member.nextBillDate).toLocaleDateString()}
                    </p>
                </div>
            </div>

            <Link to={`/member/${member._id}`} className="text-blue-400 hover:underline mt-4 inline-block font-semibold">
                View Details →
            </Link>
        </div>
    );
};

export default MemberCard;
