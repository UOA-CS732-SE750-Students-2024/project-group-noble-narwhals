import React, { useState } from 'react';
import Button from './Button'; 
import { MdOutlineMarkUnreadChatAlt, MdOutlineMessage } from "react-icons/md";

function Applicant({ username, message, avatar }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMessageRead, setIsMessageRead] = useState(false); // add new state to track if message is read

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
    setIsMessageRead(true); // set message to read when modal is opened
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 w-56 mr-4 flex-shrink-0">
      <div className="flex flex-col items-center">
        <div className={`w-16 h-16 ${avatar} rounded-full mb-2`}></div>
        <div className="text-base font-medium mb-2">{username}</div>

        {/* Show different icons depending on whether the message is read or not */}
        <button onClick={toggleModal} className="text-secondary hover:bg-red-300 p-2 rounded-full">
          {isMessageRead ? <MdOutlineMessage size={24} /> : <MdOutlineMarkUnreadChatAlt size={24} />}
        </button>

        {/* Allow , Reject button */}
        <div className="flex space-x-2 mt-2">
          <Button className="text-xxs py-1 px-2" style_type="fill">Allow</Button>
          <Button className="text-xxs py-1 px-2" style_type="border">Reject</Button>
        </div>
      </div>

      {/* modal window */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-10">
          <div className="bg-white p-4 rounded-lg">
            <p className="mb-4">{message}</p>
            <Button onClick={() => setIsModalOpen(false)} style_type="border">Close</Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Applicant;
