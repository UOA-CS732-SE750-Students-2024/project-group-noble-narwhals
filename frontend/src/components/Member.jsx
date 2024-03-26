import React from 'react';
import { TiDelete, TiUser } from "react-icons/ti";


  
    function Member({ username, role, avatar }) {
        
      
        const navigateToProfile = () => {
          if (role !== 'Host') {
            history.push(`/profile/${username}`);
          }
        };
      
        const removeFromGroup = () => {
          if (role !== 'Host') {
            // Remove user from group
            console.log(`Remove ${username}`);
          }
        };

  return (
    <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-xl space-y-2">
      <div className={`w-16 h-16 ${avatar} rounded-full`}></div>
      <span className="text-md font-medium">{username}</span>
      {role && (
        <span className="bg-gray-200 text-gray-800 rounded-full px-2 text-xs">
          {role}
        </span>
      )}
      <div className="flex space-x-2">
        {role !== 'Host' && (
          <>
            <button
              onClick={navigateToProfile}
              className="text-primary hover:text-pink-600"
              aria-label={`View profile of ${username}`}
            >
              <TiUser size={32} />
            </button>
            <button
              onClick={removeFromGroup}
              className=" text-black hover:text-red-500"
              aria-label={`Remove ${username} from group`}
            >
              <TiDelete size={32} />
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default Member;
