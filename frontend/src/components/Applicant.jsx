import React, { useState } from 'react';
import Button from './Button';

function Applicant({ username, message, avatar }) {
  const [hover, setHover] = useState(false);
  // check if message is longer than 50 characters
  const isLongMessage = message.length > 50;

  return (
    <div className="flex flex-col items-center w-60 h-96 bg-gradient-to-r from-blue-100 to-blue-300 rounded-lg overflow-hidden m-2 transition-all duration-300 ease-in-out">
      {/* User info section */}
      <div
        className={`transition-transform duration-300 ease-in-out ${hover && isLongMessage ? 'flex flex-row items-center transform scale-50 -translate-y-5 -translate-x-20' : 'flex flex-col items-center mt-6'}`}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{ transitionProperty: 'transform', willChange: 'transform' }}
      >
        {/* Avatar */}
        <div className={`w-24 h-24 ${avatar} rounded-full transition-transform duration-300 ease-in-out`}></div>


      </div>

      {/* Username, move this into the hover effect area */}
      <div className={`text-base font-medium transition-transform duration-300 ease-in-out ${hover && isLongMessage ? '  transform -translate-y-20 translate-x-15' : ''}`}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}>
        {username}
      </div>

      {/* Message container */}

      <div
        className={`flex flex-col flex-grow justify-center items-center text-center overflow-hidden cursor-pointer ${hover && isLongMessage ? 'h-auto py-4 -mt-24' : 'h-16'}`}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >

        <div className="text-sm text-gray-600">
          {isLongMessage ? (hover ? message : `${message.substring(0, 50)}...`) : message}
        </div>
      </div>

      {/* Action buttons */}
      <div className="w-full pb-4 px-4 flex justify-between">
        <Button className=" w-20 py-1" style_type="fill">Allow</Button>
        <Button className=" w-20 py-1" style_type="border">Reject</Button>
      </div>
    </div>
  );
}


export default Applicant;
