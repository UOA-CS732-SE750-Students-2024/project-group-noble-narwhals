import React from 'react';
import Button from './Button'; 

function Member({ username, role, avatar }) {
  return (
    <div className="flex flex-col items-center w-60 h-96 bg-gradient-to-r from-blue-100 to-blue-300 rounded-lg space-y-4 m-5 p-4">
      {/* Container for avatar and username */}
      <div className="flex-1 flex flex-col items-center justify-center space-y-2">
        <div className={`w-32 h-32 ${avatar} rounded-full`}></div>
        <span className="text-md font-medium text-center">{username}</span>
        {role && (
          <span className="bg-gray-200 text-gray-800 rounded-full px-2 text-xs">
            {role}
          </span>
        )}
      </div>

      {/* Conditional rendering for buttons */}
      {role !== 'Host' && (
        <div className="w-full flex justify-between pb-4">
          <Button className="w-20 py-1" style_type="fill">View</Button>
          <Button className="w-20 py-1" style_type="border">Delete</Button>
        </div>
      )}

      {/* If role is 'Host', render an empty div to maintain spacing */}
      {role === 'Host' && <div className="w-full h-14"></div>} {/* Adjust 'h-14' as needed to match the button container's height */}
    </div>
  );
}

export default Member;
