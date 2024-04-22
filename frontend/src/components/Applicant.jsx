import React, { useState } from 'react';
import Button from './Button';

function Applicant({ username, message='', avatar,isHost }) {
  const [hover, setHover] = useState(false);
  // check if message is longer than 50 characters
  const isLongMessage = message.length > 50;

  return (
    <div className=" flex flex-col items-center justify-between py-6 px-4 bg-gradient-to-br from-blue-100 to-blue-300 rounded-lg overflow-hidden m-2 transition-all duration-300 ease-in-out" style={{ width: '240px', height: '300px' }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}>
      {/* User info section */}
      <div className='flex-shrink' >
        <div className={`flex  justify-start items-center ${hover && isLongMessage ? 'flex-row  ' : 'flex-col'}`}>


          {/* Avatar */}
          <div className="some-container-class">
            <img
              src={avatar}
              alt="avatar"
              className={`rounded-full transition-transform duration-300 ease-in-out ${hover && isLongMessage ? 'w-12 h-12' : 'w-24 h-24'}`}
            />
          </div>

          {/* Username, move this into the hover effect area */}



          <div className={`text-base font-medium transition-transform duration-300 ease-in-out ${hover && isLongMessage ? 'translate-x-2  ' : ''}`}
          >
            {username}
          </div>
        </div>

        {/* Message container */}

        <div
          className={`text-center cursor-pointer ${hover && isLongMessage ? 'h-40  overflow-auto py-4 hide-scrollbar' : 'h-16 overflow-hidden'}`}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          <div className="text-sm text-gray-600">
            {message}
          </div>
        </div>

      </div>

      {/* Action buttons */}
      <div className="flex flex-row flex-initial w-full  pt-8 px-4 flex justify-around relative">
      {isHost && (
        <>
          <Button className="absolute left-3 -bottom-1 w-20 py-1 px-0" style_type="fill">Allow</Button>
          <Button className="absolute right-3 -bottom-1 w-20 py-1 px-0" style_type="border">Reject</Button>
        </>
      )}
      </div>

    </div>
  );
}


export default Applicant;
