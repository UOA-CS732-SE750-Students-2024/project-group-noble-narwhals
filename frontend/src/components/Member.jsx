import React from 'react';
import Button from './Button'; 
function Member({ username, role, avatar }) {
  
  return (
    <div className="flex flex-col items-center w-60 h-96 bg-gradient-to-r from-blue-300 to-blue-400 rounded-lg space-y-4 m-5">
      {/* Container for avatar and username */}
      <div className="space-y-2 flex-1 flex flex-col items-center justify-center pt-4">
        <div className={`w-32 h-32 ${avatar} rounded-full`}></div>
        <span className="text-md font-medium text-center">{username}</span>
        {role && (
          <span className="bg-gray-200 text-gray-800 rounded-full px-2 text-xs">
            {role}
          </span>
        )}
      </div>
      
      {/* Container for buttons */}
      {role !== 'Host' && (
        <div className="w-full pb-4 px-4 flex justify-between">
          <Button className="text-xs  w-20 py-1" style_type="fill">
            View
          </Button>
          <Button className="text-xs  w-20 py-1" style_type="border">
            Delete
          </Button>
        </div>
      )}
    </div>
  );
}

export default Member;
