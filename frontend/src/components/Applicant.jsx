import React, { useState } from 'react';
import Button from './Button';
import { MdMarkEmailUnread, MdEmail } from "react-icons/md";

function Applicant({ username, message, avatar }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [messageRead, setMessageRead] = useState(false);
  const [hasBorder, setHasBorder] = useState(false); // 新增状态控制边框

  // Function to toggle the message modal view and set border
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
    setHasBorder(!hasBorder); // 控制边框的显示
    if (!messageRead) {
      setMessageRead(true); // Mark message as read when opened
    }
  };

  // Placeholder functions for Allow/Reject actions
  const handleAllow = (e) => {
    e.stopPropagation();
    console.log('Allowed');
  };

  const handleReject = (e) => {
    e.stopPropagation();
    console.log('Rejected');
  };

  // Placeholder function to handle clicking on the icon
  const handleIconClick = (e) => {
    e.stopPropagation();
    toggleModal();
  };

  return (
    <div
      className={`relative w-60 h-96 bg-gradient-to-r from-blue-100 to-blue-300 rounded-lg overflow-hidden ${hasBorder ? 'border-4 border-blue-500' : ''}`} // 根据 hasBorder 控制边框的显示
      style={{ margin: '10px' }}
    >
      {/* Avatar */}
      <div className={`w-32 h-32 ${avatar} rounded-full transition-all duration-300 ease-in-out mx-auto mt-5`}></div>

      {/* Username and Icon container */}
      <div className="flex flex-col items-center mt-4">
        {/* Username */}
        <span className="text-lg font-medium">{username}</span>

        {/* Icon with hover effect */}
        <div className="mt-2 hover:text-blue-500 cursor-pointer" onClick={handleIconClick}>
          {messageRead ? <MdEmail size={24} className="transition-colors duration-300" /> : <MdMarkEmailUnread size={24} className="transition-colors duration-300" />}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-full flex justify-around px-4">
        <Button className="w-20 py-1" style_type="fill" onClick={handleAllow}>Allow</Button>
        <Button className="w-20 py-1" style_type="border" onClick={handleReject}>Reject</Button>
      </div>

      {/* Expanded Message View */}
      {isModalOpen && (
        <div className="absolute inset-0 bg-white p-4 rounded-lg flex flex-col">
          <div className="flex-1 overflow-auto">
            <p className="mb-4">{message}</p>
          </div>
          <div className="flex justify-end">
            <Button onClick={toggleModal} className="py-1 px-4" style_type="fill">Close</Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Applicant;
