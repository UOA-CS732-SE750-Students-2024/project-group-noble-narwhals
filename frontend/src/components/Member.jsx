import React from 'react';
import Button from './Button'; 

function Member({ username, role, avatar }) {
  return (
    <div className={`flex flex-col items-center bg-gradient-to-br from-blue-100 to-blue-300 rounded-lg space-y-4 p-4 first:ml-0 `} style={{ width: '240px', height: '300px' }}>      {/* Container for avatar and username */}
      <div className="flex-1 flex flex-col items-center justify-between space-y-2">
        <div className={`w-32 h-32 ${avatar} rounded-full`}></div>
        <span className="text-md font-medium text-center">{username}</span>
        {role && (
          <span className="bg-gray-200 text-gray-800 rounded-full px-2 text-xs">
            {role}
          </span>
        )}
      </div>

      {/* Buttons container */}
      <div className="w-full flex justify-between pb-4">
        {role !== 'Host' && (
          <>
            <Button className="w-20 py-1 px-0" style_type="fill">View</Button>
            <Button className="w-20 py-1 px-0" style_type="border">Delete</Button>
          </>
        )}
        {/* If role is 'Host', render empty spans to maintain spacing */}
        {role === 'Host' && (
          <>
            <span className="w-20 h-9"></span> {/* Placeholder for View button */}
            <span className="w-20 h-9"></span> {/* Placeholder for Delete button */}
          </>
        )}
      </div>
    </div>
  );
}



export default Member;