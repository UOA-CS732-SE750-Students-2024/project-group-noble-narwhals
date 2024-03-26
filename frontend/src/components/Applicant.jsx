import React, { useState } from 'react';
import Button from './Button';

function Applicant({ username, message, avatar }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleMessageDisplay = () => {
    setIsExpanded(!isExpanded);
  };
 

  return (
    <div className="flex flex-col items-center p-4 w-64 h-80 bg-white rounded-lg shadow-lg space-y-4 transition-all duration-300 ease-in-out">
      <div className={`w-16 h-16 rounded-full ${avatar} transition-all duration-300 ease-in-out transform ${isExpanded ? 'scale-75' : 'scale-100'}self-center`}></div>
      <div className="text-base font-medium mb-2">{username}</div>
      <div className={`relative text-sm text-gray-600 mb-4 px-2 transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-40 overflow-y-auto' : 'h-16 overflow-hidden'}`}>
        {message}
      </div>
      {message.length > 50 && (
        <button className=" text-white bg-secondary hover:bg-pink-600 text-xs mb-2" onClick={toggleMessageDisplay}>
          {isExpanded ? 'Less' : 'More'}
        </button>
      )}
      <div className="flex space-x-2 justify-center w-full">
        <Button className="text-xs w-1/2 py-1 px-1" style_type="fill">Allow</Button>
        <Button className="text-xs w-1/2 py-1 px-1" style_type="border">Reject</Button>
      </div>
    </div>
  );
}

export default Applicant;
