import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Button from "./Button";
import { useAuth } from "../store/AuthContext";
import { MdFavorite, MdFavoriteBorder } from "react-icons/md";

function HeaderContent({
  groupName,
  groupTags,
  postedDate,
  activityDetails,
  isHost,
  groupId,
  deadlineDate,
  groupStatus,
  groupMembers,
  onAddApplication,
  onApplicationRemove,
  onMemberHandler,
  groupType,
}) {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [hasApplied, setHasApplied] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [applicationMessage, setApplicationMessage] = useState("");
  const { isLoggedIn, user, updateAuth } = useAuth();
  const [liked, setLiked] = useState(false);
  const navigate = useNavigate();


  const isGroupMember =
    user && groupMembers.some((member) => member._id === user._id);
  const deadline = deadlineDate ? new Date(deadlineDate) : new Date(); // Fallback to current date if undefined
  const now = new Date();
  const isPastDeadline = now > deadline;
  useEffect(() => {
    if (isLoggedIn && groupId && user) {
      fetchApplicationStatus();
      checkLikeStatus();
    }
  }, [isLoggedIn, groupId, user]);

  const fetchApplicationStatus = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/groups/${groupId}/has-applied`,
        {
          params: { userId: user._id },
        }
      );

      setHasApplied(response.data.hasApplied);
      setApplicationStatus(response.data.status);
    } catch (error) {
      console.error("Error checking application status:", error);
    }
  };

  const checkLikeStatus = async () => {
    if (isLoggedIn && groupId && user._id) {
      const isLiked = user.likedGroups.some((group) => group._id === groupId);
      setLiked(isLiked);

    }
  };

  const toggleLike = async () => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    const newLikedStatus = !liked;
    setLiked(newLikedStatus);

    const endpoint = newLikedStatus ? `like/${groupId}` : `unlike/${groupId}`;
    try {
      await axios.post(`${API_BASE_URL}/api/user/${endpoint}`, {
        userId: user._id,
      });
      updateAuth();

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
            `${API_BASE_URL}/api/groups/cancel-application/${groupId}`,

            { userId: user._id }
          );

          setHasApplied(false);
          setApplicationStatus("");
          onApplicationRemove(user._id);
          setShowModal(false);
          updateAuth();
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
    if (!groupId) {
      alert("Group ID is missing.");
      return;
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/groups/join/${groupId}/group`,

        {
          userId: user._id,
          message: applicationMessage,
        }
      );

      setHasApplied(true);
      setApplicationStatus("pending");
      setShowModal(false);

      const newApp = {
        applicantId: { _id: user._id, avatar: user.avatar, name: user.name },
        groupStatus: "available",
        applicationStatus: "pending",
        message: applicationMessage,
      };
      onAddApplication(newApp);
      updateAuth();
    } catch (error) {
      alert(
        "Failed to apply to the group: " +
        (error.response?.data?.message || error.message)
      );
    }
  };

  const handleEditGroup = () => {
    navigate(`/updategroup/${groupId}`);
  };

  const handleQuitGroup = async () => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    if (!window.confirm("Are you sure you want to quit the group?")) {
      return;
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/groups/quit/${groupId}`,
        { userId: user._id }
      );
      onMemberHandler(user._id, "remove");
      updateAuth();

    } catch (error) {
      alert(
        "Failed to leave the group: " +
        (error.response?.data?.message || error.message)
      );
    }
  };

  const handleDismissGroup = async () => {
    if (!isHost) return;
    if (
      window.confirm(
        "Are you sure you want to dismiss this group? This action cannot be undone."
      )
    ) {
      try {
        const response = await axios.patch(
          `${API_BASE_URL}/api/groups/dismiss/${groupId}`,

          {
            groupStatus: "dismissed",
          }
        );

        alert("Group has been successfully dismissed.");
        navigate("/");
      } catch (error) {
        alert(
          "Failed to dismiss the group: " +
          (error.response?.data?.message || error.message)
        );
      }
    }
  };

  const handleCloseGroup = async () => {
    if (!isHost) return;

    if (
      window.confirm(
        "Are you sure you want to close this group? This action will set the group status to closed."
      )
    ) {
      try {
        const response = await axios.patch(
          `${API_BASE_URL}/api/groups/close/${groupId}`,
          {
            groupStatus: "closed",
          }
        );
        navigate("/");
        alert("The group has been closed successfully.");
        navigate("/");
      } catch (error) {
        alert(
          "Failed to close the group: " +
          (error.response?.data?.message || error.message)
        );
      }
    }
  };

  return (
    <div className="max-w-main_content mx-auto mt-20 px-6 py-4">
      <div className="header-content flex justify-between items-start mb-4">
        <div className="header-title">
          <div className="text-4xl font-bold mb-2">{groupName}</div>
          <div>
            {groupType === "group" ? (
              <Link to="/" className="text-primary">
                Group
              </Link>
            ) : (
              <Link to="/" className="text-primary">
                Activity
              </Link>
            )}
          </div>
          <div className="activity-detail py-6 mt-1">
            <p className="mb-2 flex items-center text-1xl">{groupTags}</p>
            <p className="mb-2 -mt-6 text-sm text-gray-500">
              Posted {postedDate}
            </p>
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
          {isHost && (
            <>
              <Button
                className="px-4 py-1.5 sm:px-3 sm:py-1 md:px-4 md:py-1.5 lg:px-6 lg:py-2"
                style_type="border"
                onClick={handleEditGroup}
              >
                Edit
              </Button>
              {groupStatus !== "closed" && groupStatus !== "dismissed" && (
                <>
                  {!isPastDeadline && (
                    <Button
                      className="px-4 py-1.5 sm:px-3 sm:py-1 md:px-4 md:py-1.5 lg:px-6 lg:py-2"
                      style_type="border"
                      onClick={handleDismissGroup}
                    >
                      Dismiss Group
                    </Button>
                  )}
                  {isPastDeadline && (
                    <Button
                      className="px-4 py-1.5 sm:px-3 sm:py-1 md:px-4 md:py-1.5 lg:px-6 lg:py-2"
                      style_type="border"
                      onClick={handleCloseGroup}
                    >
                      Close Group
                    </Button>
                  )}
                </>
              )}
              {(groupStatus === "closed" ||
                groupStatus === "dismissed" ||
                groupStatus === "full") && (
                  <div className="py-2 px-4 bg-gray-200 rounded-full" style_type="border">
                    {groupStatus === "closed"
                      ? "This group is closed"
                      : groupStatus === "dismissed"
                        ? "This group is dismissed"
                        : "This group is full"}
                  </div>
                )}

            </>
          )}
          {!isHost && (
            <>
              {groupStatus === "full" ? (
                <div className="flex flex-col items-center py-3 px-16">
                  {isGroupMember && (
                    <Button
                      className="px-4 py-1.5 sm:px-3 sm:py-1 md:px-4 md:py-1.5 lg:px-6 lg:py-2"
                      style_type="border"
                      onClick={handleQuitGroup}
                    >
                      Quit Group
                    </Button>
                  )}
                  <div className="py-2 px-4 mt-2 bg-gray-200 rounded-full">This group is full</div>
                </div>
              ) : groupStatus === "available" ? (
                <>
                  {!isGroupMember && (hasApplied ? (
                    <Button
                      className="px-4 py-1.5 sm:px-3 sm:py-1 md:px-4 md:py-1.5 lg:px-6 lg:py-2"

                      style_type="border"
                      onClick={handleCancelApplication}
                    >
                      Cancel
                    </Button>
                  ) : (
                    <Button
                      className="px-4 py-1.5 sm:px-3 sm:py-1 md:px-4 md:py-1.5 lg:px-6 lg:py-2"
                      style_type="fill"
                      onClick={handleJoinButtonClick}
                    >
                      Join
                    </Button>
                  ))}
                  <Button
                    className="px-4 py-1.5 sm:px-3 sm:py-1 md:px-4 md:py-1.5 lg:px-6 lg:py-2 flex items-center"
                    style_type="border"
                    onClick={toggleLike}
                  >
                    {liked ? (
                      <MdFavorite color="red" size="24px" />
                    ) : (
                      <MdFavoriteBorder size="24px" />
                    )}
                    <span className="ml-1">{liked ? "Liked" : "Like"}</span>
                  </Button>
                  {isGroupMember && (
                    <Button
                      className="px-4 py-1.5 sm:px-3 sm:py-1 md:px-4 md:py-1.5 lg:px-6 lg:py-2"
                      style_type="border"
                      onClick={handleQuitGroup}
                    >
                      Quit Group
                    </Button>
                  )}
                </>
              ) : (
                <div className="py-2 px-4 bg-gray-200 rounded-full" style_type="border">
                  This group is {groupStatus}
                </div>
              )}
            </>
          )}
        </div>
      </div>
      {showModal && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
          id="my-modal"
        >
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Application Message
              </h3>
              <textarea
                className="mt-2 p-2 min-h-24 w-full text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
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
