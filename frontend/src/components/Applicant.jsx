import React, { useState } from 'react';
import Button from './Button';
import axios from 'axios';

function Applicant({ username, message='', avatar, isHost, applicationId }) {
  console.log(`Applicant ID for ${username}: ${applicationId}`); 
  const [hover, setHover] = useState(false);
  const isLongMessage = message.length > 50;

  const handleAccept = async () => {
    console.log('Application ID for accept:', applicationId);
    try {
        const response = await axios.patch(`http://localhost:3000/api/application/applications-with-details/${applicationId}`, {
            applicationStatus: 'accepted'
        });
        console.log(response.data);
        alert('Application accepted successfully!');
    } catch (error) {
        console.error('Failed to accept application:', error);
        alert('Failed to accept application: ' + (error.response?.data?.message || error.message));
    }
};

const handleReject = async () => {
  console.log('Applicant ID for reject:', applicationId);
  console.log('Application ID for reject:', applicationId);
    try {
        const response = await axios.patch(`http://localhost:3000/api/application/applications-with-details/${applicationId}`, {
            applicationStatus: 'rejected'
        });
        console.log(response.data);
        alert('Application rejected successfully!');
    } catch (error) {
        console.error('Failed to reject application:', error);
        alert('Failed to reject application: ' + (error.response?.data?.message || error.message));
    }
};


  return (
    <div className="flex flex-col items-center justify-between py-6 px-4 bg-gradient-to-br from-blue-100 to-blue-300 rounded-lg overflow-hidden m-2 transition-all duration-300 ease-in-out" style={{ width: '240px', height: '300px' }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}>
      <div className='flex-shrink' >
        <div className={`flex justify-start items-center ${hover && isLongMessage ? 'flex-row' : 'flex-col'}`}>
          <img src={avatar} alt="avatar" className={`rounded-full transition-transform duration-300 ease-in-out ${hover && isLongMessage ? 'w-12 h-12' : 'w-24 h-24'}`} />
          <div className={`text-base font-medium transition-transform duration-300 ease-in-out ${hover && isLongMessage ? 'translate-x-2' : ''}`}>
            {username}
          </div>
        </div>
        <div className={`text-center cursor-pointer ${hover && isLongMessage ? 'h-40 overflow-auto py-4 hide-scrollbar' : 'h-16 overflow-hidden'}`}>
          <div className="text-sm text-gray-600">{message}</div>
        </div>
      </div>
      {isHost && (
        <div className="flex flex-row flex-initial w-full pt-8 px-4 justify-around relative">
          <Button onClick={handleAccept} className="w-20 py-1 px-0" style_type="fill">Allow</Button>
          <Button onClick={handleReject} className="w-20 py-1 px-0" style_type="border">Reject</Button>
        </div>
      )}
    </div>
  );
}

export default Applicant;
