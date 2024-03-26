import React, { useState } from 'react';
import Button from './Button';

function Applicant({ username, message, avatar }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleMessageDisplay = () => {
    setIsExpanded(!isExpanded);
  };

  // 当卡片展开时，文本容器需要添加额外的类来显示滚动条
  const messageContainerClasses = isExpanded
    ? 'absolute top-14 right-4 bottom-16 left-20 overflow-y-scroll'
    : 'h-16 overflow-hidden';

  return (
    <div className={`relative w-64 h-80 bg-white rounded-lg shadow-lg transition-all duration-300 ease-in-out ${isExpanded ? 'pt-16 pb-4 px-4' : 'p-4 space-y-4 flex flex-col items-center'}`}>

      {/* Avatar */}
      <div className={`${avatar} w-16 h-16 rounded-full transition-all duration-300 ease-in-out transform ${isExpanded ? 'absolute top-4 left-4 scale-50' : ''}`}></div>
      
      {/* Username - show to the right of avatar when expanded */}
      <div className={`text-base font-medium ${isExpanded ? 'absolute top-4 left-20' : 'mb-2'}`}>
        {username}
      </div>
      
      {/* Message container with conditional class for scrolling */}
      <div className={`text-sm text-gray-600 transition-all duration-300 ease-in-out ${messageContainerClasses}`}>
        {message}
      </div>
      
      {/* More/Less button */}
      {message.length > 50 && (
        <button className={`text-blue-500 hover:text-pink-600 text-xs absolute ${isExpanded ? 'right-4 top-4' : 'right-4 bottom-16'}`} onClick={toggleMessageDisplay}>
          {isExpanded ? 'Less' : '...More'}
        </button>
      )}
      
      {/* Action buttons */}
      
        <div className="flex space-x-2 justify-center w-full absolute bottom-4">
          <Button className="text-xxs w-1/3 py-1 px-4" style_type="fill">Allow</Button>
          <Button className="text-xxs w-1/3 py-1 px-4" style_type="border">Reject</Button>
        </div>
      
    </div>
  );
}

export default Applicant;
