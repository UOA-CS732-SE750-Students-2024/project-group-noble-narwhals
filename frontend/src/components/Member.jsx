import React from 'react';
import Button from './Button';
import { useNavigate } from 'react-router-dom';

function Member({ username, avatar, memberId, ownerId, isCurrentUserHost }) {
  const navigate = useNavigate();

  const viewProfile = () => {
    navigate(`/user/profile/${memberId}`);
  };

  return (
    <div className={`flex flex-col items-center bg-gradient-to-br from-blue-100 to-blue-300 rounded-lg space-y-4 p-4`} style={{ width: '240px', height: '300px' }}>
      <div className="flex-1 flex flex-col items-center justify-between space-y-2">
        <img src={avatar} alt="avatar" className="w-32 h-32 rounded-full" />
        <span className="text-md font-medium text-center">{username}</span>
        {memberId === ownerId && (
          <span className="bg-red-200 text-red-800 rounded-full px-2 text-xs">Host</span>
        )}
      </div>
      <div className="w-full flex justify-center pb-4">
        {/* Always show the View button */}
        <Button onClick={viewProfile} className="w-20 py-1 px-0" style_type="fill">View</Button>
        
        {/* Additional buttons for the host when viewing their own profile */}
        {isCurrentUserHost && memberId === ownerId && (
          <>
            <Button className="w-20 py-1 px-0 ml-4" style_type="border">Delete</Button>
          </>
        )}
      </div>
    </div>
  );
}

export default Member;
