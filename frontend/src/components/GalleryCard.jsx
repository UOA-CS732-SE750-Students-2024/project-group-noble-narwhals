import React, { useEffect, useState, useRef } from "react";
import { MdFavorite } from "react-icons/md";
import { MdFavoriteBorder } from "react-icons/md";
import AvatarGroup from "./AvatarGroup";
import { Link } from "react-router-dom";
import { useAuth } from "../store/AuthContext";
import axios from "axios";

const GalleryCard = ({
  title,
  id,
  dayNum,
  isFavorite,
  imageLink,
  num,
  numLimit,
  description,
}) => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const { isLoggedIn, user } = useAuth();
  const [hasApplied, setHasApplied] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [liked, setLiked] = useState(isFavorite);
  const [applicationMessage, setApplicationMessage] = useState("");
  const [textLength, setTextLength] = useState(90);
  const [isMember, setIsMember] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const crWidth = entry.contentRect.width;
        if (crWidth < 210) {
          setTextLength(65);
        } else if (crWidth < 260) {
          setTextLength(100);
        } else {
          setTextLength(120);
        }
      }
    });

    if (cardRef.current) {
      resizeObserver.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        resizeObserver.unobserve(cardRef.current);
      }
    };
  }, []);
  useEffect(() => {
    setLiked(isFavorite);
  }, [isFavorite]);
  useEffect(() => {
    if (isLoggedIn && id && user) {
      fetchApplicationStatus();
      checkLikeStatus();
    }
  }, [isLoggedIn, id, user]);

  const fetchApplicationStatus = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/groups/${id}/detail`);
      if (res.status === 200) {
        setIsMember(
          res.data.groupMembers.some((member) => member._id === user._id)
        );

        const applied = res.data.application.find(
          (application) => application.applicantId._id === user._id
        );
        if (applied) {
          setHasApplied(true);
          setApplicationStatus(applied.applicationStatus);
        }
      }
    } catch (error) {
      console.error("Error checking application status:", error);
    }
  };

  const checkLikeStatus = async () => {
    if (isLoggedIn && id && user._id) {
      try {
        const isLiked = user.likedGroups.some((group) => group._id === id);
        setLiked(isLiked);
      } catch (error) {
        console.error("Error checking like status:", error);
      }
    }
  };

  const toggleLike = async () => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    const newLikedStatus = !liked;
    setLiked(newLikedStatus);

    const endpoint = newLikedStatus ? `like/${id}` : `unlike/${id}`;
    try {
      await axios.post(`${API_BASE_URL}/api/user/${endpoint}`, {
        userId: user._id,
      });
    } catch (error) {
      console.error("Failed to toggle like:", error);
      setLiked(!newLikedStatus);
    }
  };

  const handleJoinButtonClick = () => {
    if (!isLoggedIn) {
      navigate("/login");
    } else {
      // Handle application status before showing modal
      if (applicationStatus === "accepted") {
        alert("You are already a member of this group.");
      } else if (applicationStatus === "pending") {
        alert("Your application is still pending.");
      } else if (applicationStatus === "rejected" || !hasApplied) {
        setShowModal(true); // Allow re-application if rejected or no prior application
      }
    }
  };

  const handleCancelApplication = async () => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    if (hasApplied && applicationStatus !== "accepted") {
      // Prevent canceling if already accepted
      if (window.confirm("Are you sure you want to cancel your application?")) {
        try {
          const response = await axios.post(
            `${API_BASE_URL}/api/groups/cancel-application/${id}`,
            { userId: user._id }
          );
          setHasApplied(false);
          setApplicationStatus("");
          setShowModal(false);
        } catch (error) {
          alert(
            "Failed to cancel the application: " +
              (error.response?.data?.message || error.message)
          );
        }
      }
    }
  };

  const handleJoinGroup = async () => {
    if (!id) {
      alert("Group ID is missing.");
      return;
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/groups/join/${id}/group`,
        {
          userId: user._id,
          message: applicationMessage,
        }
      );
      setHasApplied(true);
      setApplicationStatus("pending");
      setShowModal(false);
    } catch (error) {
      alert(
        "Failed to apply to the group: " +
          (error.response?.data?.message || error.message)
      );
    }
  };
  const hostAvatar = imageLink[0];
  const groupImage = imageLink;
  return (
    <div className="bg-white p-4 rounded-lg shadow-basic hover:bg-slate-100 min-w-40">
      <div className="flex justify-between min-w-40">
        <div className="flex flex-row justify-between min-w-32">
          <img
            key={1}
            className="inline-block h-10 w-10 rounded-full ring-2 ring-white bg-gray-500 items-center"
            src={hostAvatar}
            alt={`Host Avatar`}
          />
          <div className="flex flex-col justify-center ml-3 w-full min-w-24">
            <Link
              to={`/group/${id}`}
              className="text-base font-bold text-sky-800 hover:underline"
            >
              <h1 className="truncate">{title}</h1>
            </Link>
            <div className="text-xs text-gray-400">{dayNum} days left</div>
          </div>
        </div>

        <div className="flex items-center w-6">
          {/* favarite button */}
          <button
            aria-label="Favorite"
            className={`flex justify-center items-center rounded-full p-0 h-6 w-6 ${
              isLoggedIn ? "hover:scale-110" : "opacity-50 cursor-not-allowed"
            }`}
            disabled={!isLoggedIn}
            onClick={isLoggedIn ? toggleLike : null}
          >
            {liked ? (
              <MdFavorite size={28} color="red" />
            ) : (
              <MdFavoriteBorder size={28} />
            )}
          </button>
        </div>
      </div>

      <div
        className="text-base text-sky-700 font-thin m-2 h-28 min-w-24 "
        ref={cardRef}
      >
        <p className="max-w-full overflow-wrap break-words max-h-28">
          {description.length > 90 ? (
            <>
              {description.substring(0, textLength)}
              <Link to={`/group/${id}`} className="ml-2">
                ...
              </Link>
            </>
          ) : (
            description
          )}
        </p>
      </div>
      <div className="flex justify-between items-center">
        <AvatarGroup imageSources={groupImage} num={num} numLimit={numLimit} />
        <button
          className={`flex justify-center items-center text-sky-800  border-solid border-2 border-sky-800 rounded-xl w-min h-6 ${
            isLoggedIn && !isMember
              ? "hover:scale-110"
              : "opacity-50 cursor-not-allowed"
          }`}
          onClick={() => {
            if (isLoggedIn && !isMember) {
              hasApplied ? handleCancelApplication() : handleJoinButtonClick();
            }
          }}
          disabled={!isLoggedIn || isMember}
        >
          {isMember ? "Applied" : hasApplied ? "Cancel" : "Join"}
        </button>
      </div>
      {showModal && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full"
          id="my-modal"
        >
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Application Message
              </h3>
              <textarea
                className="mt-2 p-2 w-full text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
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
};

export default GalleryCard;
