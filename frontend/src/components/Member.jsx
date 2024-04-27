import React from 'react';
import Button from './Button';
import { useNavigate } from 'react-router-dom';
import  axios from 'axios';

function Member({ username, avatar, memberId, ownerId, isCurrentUserHost, groupId }) {
  const navigate = useNavigate();

  const viewProfile = () => {
    navigate(`/user/profile/${memberId}`);
  };

  const handleDelete = async (groupId, memberId) => {
    const confirmDelete = confirm("Are you sure you want to remove this member from the group?");
    if (confirmDelete) {
        console.log('Deleting member with groupId:', groupId);
        try {
            const response = await axios.patch(`http://localhost:3000/api/groups/remove-member/${groupId}`, {
                memberId: memberId 
            });
            console.log('Member removed successfully:', response.data);
            alert('Member removed successfully!');  
        } catch (error) {
            console.error('Error in removing member:', error.response.data);
            alert('Failed to remove member: ' + error.response.data.message);  
        }
    } else {
        alert("Member removal canceled.");  
    }
};



  // Condition to determine if the Delete button should be shown: the current user must be the host and must not be viewing their own profile
  const showDeleteButton = isCurrentUserHost && memberId !== ownerId;

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
        <Button onClick={viewProfile} className="w-20 py-1 px-0" style_type="fill">View</Button>
        {showDeleteButton && (
          <Button onClick={() => handleDelete(groupId, memberId)} className="w-20 py-1 px-0 ml-4" style_type="border">Delete</Button>
        )}
      </div>
    </div>
  );
}

export default Member;
