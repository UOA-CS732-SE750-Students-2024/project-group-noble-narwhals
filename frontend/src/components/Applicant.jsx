import React, { useState } from 'react';
import Button from './Button';

function Applicant({ username, message, avatar }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleMessageDisplay = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={`relative w-60 h-96 bg-gradient-to-r from-blue-300 to-blue-400 rounded-lg transition-all duration-300 ease-in-out overflow-hidden ${isExpanded ? 'pt-32 pb-4 px-4' : 'p-4 flex flex-col items-center justify-between'}`} style={{ margin: '10px' }}>

      {/* Avatar */}
      <div className={`${avatar} w-32 h-32 rounded-full transition-all duration-300 ease-in-out ${isExpanded ? 'absolute top-4 left-[1px] scale-[0.35]' : 'self-center mt-5'}`}></div>

      {/* Username */}
      <div className={`text-base font-medium transition-all duration-300 ease-in-out ${isExpanded ? 'absolute top-16 left-28' : 'mt-2 self-center'}`}>
        {username}
      </div>

      {/* Message container */}
      <div className={`text-sm text-gray-600 transition-all duration-300 ease-in-out ${isExpanded ? 'absolute top-20 right-4 bottom-20 left-24 overflow-y-auto' : 'h-16 self-center w-full text-center mt-[-1rem]'}`}>
  <p className={`${!isExpanded ? 'truncate' : ''}`}>{message}</p>
</div>
      {/* More/Less button */}
      {message.length > 50 && (
        <button className={`text-blue-500 hover:text-pink-600 text-xs ${isExpanded ? 'absolute top-4 right-4' : 'self-center mt-2'}`} onClick={toggleMessageDisplay}>
          {isExpanded ? 'Less' : 'More'}
        </button>
      )}

      {/* Action buttons, which don't move after 'More' is clicked */}
      <div className="flex space-x-2 justify-center w-full absolute bottom-4">
        <Button className="text-xs  w-20 py-1" style_type="fill">Allow</Button>
        <Button className="text-xs  w-20 py-1 " style_type="border">Reject</Button>
      </div>
    </div>
  );
}

export default Applicant;
