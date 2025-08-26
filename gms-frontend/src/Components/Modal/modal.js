import React from 'react';
import ClearIcon from '@mui/icons-material/Clear';

const Modal = ({ handleClose, content, header }) => {
  return (
    // This is the semi-transparent background overlay that covers the whole screen
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50"
      onClick={handleClose} // This allows closing the modal by clicking the background
    >
      {/* This is the actual modal content box */}
      <div 
        className="bg-gray-800 rounded-lg shadow-xl w-full max-w-lg mx-4"
        onClick={(e) => e.stopPropagation()} // This prevents the modal from closing when you click inside it
      >
        {/* Modal Header */}
        <div className="p-4 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">{header}</h2>
          <button 
            onClick={handleClose}
            className="text-white hover:text-gray-400"
          >
            <ClearIcon />
          </button>
        </div>
        
        {/* Modal Body/Content */}
        <div className='p-6'>
          {content}
        </div>
      </div>
    </div>
  );
}

export default Modal;