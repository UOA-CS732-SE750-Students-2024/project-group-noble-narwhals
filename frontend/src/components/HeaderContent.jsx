import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Button from './Button';
import { useAuth } from '../store/AuthContext';
import { MdFavorite, MdFavoriteBorder } from 'react-icons/md';

function HeaderContent({ groupName, groupTags, postedDate, activityDetails, isHost, groupId }) {
  const [hasApplied, setHasApplied] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [applicationMessage, setApplicationMessage] = useState('');
  const { isLoggedIn, user } = useAuth();
  const [liked, setLiked] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn && groupId && user) {
      fetchApplicationStatus();
      checkLikeStatus();
    }
  }, [isLoggedIn, groupId, user]);

  const fetchApplicationStatus = async () => {
    try {
        const response = await axios.get(`http://localhost:3000/api/groups/${groupId}/has-applied`, {
            params: { userId: user._id }
        });
        setHasApplied(response.data.hasApplied);
        setApplicationStatus(response.data.status);
    } catch (error) {
        console.error('Error checking application status:', error);
    }
  };

  const checkLikeStatus = async () => {
    if (isLoggedIn && groupId && user._id) {
      try {
        const response = await axios.get(`http://localhost:3000/api/user/${user._id}/likes/${groupId}`);
        setLiked(response.data.liked);
      } catch (error) {
        console.error('Error checking like status:', error);
      }
    }
  };

  const toggleLike = async () => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    const newLikedStatus = !liked;
    setLiked(newLikedStatus);

    const endpoint = newLikedStatus ? `like/${groupId}` : `unlike/${groupId}`;
    try {
      await axios.post(`http://localhost:3000/api/user/${endpoint}`, { userId: user._id });
    } catch (error) {
      console.error('Failed to toggle like:', error);
      setLiked(!newLikedStatus);
    }
  };

  const handleJoinButtonClick = () => {
    if (!isLoggedIn) {
      navigate('/login');
    } else {
      // Handle application status before showing modal
      if (applicationStatus === 'accepted') {
        alert('You are already a member of this group.');
      } else if (applicationStatus === 'pending') {
        alert('Your application is still pending.');
      } else if (applicationStatus === 'rejected' || !hasApplied) {
        setShowModal(true); // Allow re-application if rejected or no prior application
      }
    }
  };

  const handleCancelApplication = async () => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    if (hasApplied && applicationStatus !== 'accepted') { // Prevent canceling if already accepted
      if (window.confirm("Are you sure you want to cancel your application?")) {
        try {
          const response = await axios.post(`http://localhost:3000/api/groups/cancel-application/${groupId}`, { userId: user._id });
          setHasApplied(false);
          setApplicationStatus('');
          alert('Your application has been cancelled.');
          setShowModal(false);
        } catch (error) {
          alert('Failed to cancel the application: ' + (error.response?.data?.message || error.message));
        }
      }
    }
  };

  const handleJoinGroup = async () => {
    if (!groupId) {
      alert("Group ID is missing.");
      return;
    }

    try {
      const response = await axios.post(`http://localhost:3000/api/groups/join/${groupId}/group`, {
        userId: user._id,
        message: applicationMessage
      });
      setHasApplied(true);
      setApplicationStatus('pending'); 
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
          <div className="activity-detail py-6 -mt-10">
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
          ) : (
            <Button className={`py-3 px-16 ${hasApplied ? 'style_type="border"' : 'style_type="fill"'}`} onClick={hasApplied ? handleCancelApplication : handleJoinButtonClick} >
              {applicationStatus === 'accepted' ? 'Member' : (hasApplied ? 'Cancel' : 'Join')}
            </Button>
          )}
          {!isHost && isLoggedIn && (
            <Button className="py-3 px-16 flex items-center" style_type="border" onClick={toggleLike}>
              {liked ? <MdFavorite color="red" size="24px" /> : <MdFavoriteBorder size="24px" />}
              <span className="ml-1">{liked ? 'Liked' : 'Like'}</span>
            </Button>
          )}
        </div>
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" id="my-modal">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Application Message</h3>
              <textarea
                className="mt-2 px-7 py-3 w-full text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                rows="3"
                placeholder="Enter your message"
                value={applicationMessage}
                onChange={(e) => setApplicationMessage(e.target.value)}
              />
              <button
                className="mt-4 px-4 py-2 bg-primary text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-green-300"
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
      )}
    </div>
  );
}

export default HeaderContent;
