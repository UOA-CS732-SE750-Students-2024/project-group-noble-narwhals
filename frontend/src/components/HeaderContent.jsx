import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Button from './Button';
import { useAuth } from '../store/AuthContext'; 

function HeaderContent({ groupName, groupTags, postedDate, activityDetails, isHost, groupId }) {
  const [hasApplied, setHasApplied] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [applicationMessage, setApplicationMessage] = useState('');
  const { isLoggedIn, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn && groupId) {
      checkApplicationStatus();
    }
  }, [isLoggedIn, groupId]);

  const checkApplicationStatus = async () => {
    try {
      // Assuming the endpoint exists and returns whether the user has applied
      const response = await axios.get(`http://localhost:3000/api/groups/${groupId}/has-applied`, {
        params: { userId: user._id }
      });
      if (response.data.hasApplied) {
        setHasApplied(true);
      }
    } catch (error) {
      console.error('Error checking application status:', error);
    }
  };

  const handleJoinButtonClick = () => {
    if (!isLoggedIn) {
      navigate('/login'); // Redirect non-logged-in users directly to login page
    } else {
      setShowModal(true); // Show modal only if user is logged in
    }
  };

  const handleJoinGroup = async () => {
    if (!groupId) {
      alert("Group ID is missing.");
      return;
    }

    try {
      const response = await axios.post(`http://localhost:3000/api/groups/join/${groupId}`, {
        message: applicationMessage
      });
      setHasApplied(true);
      setShowModal(false);
      alert('Your application to join the group has been submitted!');
    } catch (error) {
      alert('Failed to apply to the group: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleEditGroup = () => {
    navigate(`/creategroup/${groupId}`); 
  };

  return (
    <div className="max-w-main_content mx-auto mt-20 px-6 py-4">
      <div className="header-content flex justify-between items-start mb-4">
        <div className="header-title">
          <div className="text-4xl font-bold mb-2">{groupName}</div>
          <Link to="/" className="text-primary">Activity</Link>
          <div className="activity-detail py-6 mt-1">
            <p className="mb-2 flex items-center text-1xl">{groupTags}</p>
            <p className="mb-2 -mt-6 text-sm text-gray-500">Posted {postedDate}</p>
          </div>
          <div className="-mt-6">
            {activityDetails.map((detail, index) => (
              <div key={index} className="flex items-center mb-2">
                {detail.icon}
                <span className="ml-2">{detail.text}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="actions flex flex-col space-y-2">
          {isHost ? (
            <Button className="py-3 px-16" style_type="border" onClick={handleEditGroup}>Edit</Button>
          ) : hasApplied ? (
            <Button className="py-3 px-16" style_type="border" disabled>Applied</Button>
          ) : (
            <Button className="py-3 px-16" style_type="fill" onClick={handleJoinButtonClick}>Join</Button>
          )}
        </div>
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" id="my-modal">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Application Message</h3>
              <div className="mt-2 px-7 py-3">
                <textarea
                  className="px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                  rows="3"
                  placeholder="Enter your message"
                  value={applicationMessage}
                  onChange={(e) => setApplicationMessage(e.target.value)}
                />
              </div>
              <div className="items-center px-4 py-3">
                <button
                  className="px-4 py-2 bg-primary text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-green-300"
                  onClick={handleJoinGroup}
                >
                  Submit Application
                </button>
                <button
                  className="mt-3 px-4 py-2 bg-secondary text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-300"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default HeaderContent;
