import React from "react";
import Button from "./Button";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Member({
  username,
  avatar,
  memberId,
  ownerId,
  isCurrentUserHost,
  groupId,
  onMemberHandler,
}) {
  const navigate = useNavigate();
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  const viewProfile = () => {
    navigate(`/user/profile/${memberId}`);
  };

  const handleDelete = async (groupId, memberId) => {
    const confirmDelete = confirm(
      "Are you sure you want to remove this member from the group?"
    );
    if (confirmDelete) {
      try {
        const response = await axios.patch(
          `${apiBaseUrl}/api/groups/remove-member/${groupId}`,
          {
            memberId: memberId,
          }
        );
        onMemberHandler(memberId, "remove");
      } catch (error) {
        console.error("Error in removing member:", error.response.data);
        alert("Failed to remove member: " + error.response.data.message);
      }
    }
  };

  // Condition to determine if the Delete button should be shown: the current user must be the host and must not be viewing their own profile
  const showDeleteButton = isCurrentUserHost && memberId !== ownerId;

  return (
    <div
      className={`flex flex-col justify-between items-center bg-gradient-to-br from-bg1 to-bg2 rounded-lg space-y-4 p-4 `}
      style={{ width: "240px", height: "300px" }}
    >
      <div className="flex-1 flex flex-col items-center justify-start space-y-2  mt-2">
        <img src={avatar} alt="avatar" className="w-32 h-32 rounded-full" />
        <span className="text-lg font-medium text-center">{username}</span>
        {memberId === ownerId && (
          <span className="bg-red-200 text-red-800 rounded-full px-2 text-sm">
            Host
          </span>
        )}
      </div>
      <div className="w-full flex justify-center pb-4">
        <Button
          onClick={viewProfile}
          className="w-24 h-9 py-1 px-0"
          style_type="fill"
        >
          View
        </Button>
        {showDeleteButton && (
          <Button
            onClick={() => handleDelete(groupId, memberId)}
            className="w-24 h-9 py-1 px-0 ml-4  bg-slate-400 hover:bg-slate-700 text-slate-900 border-none"
          >
            Delete
          </Button>
        )}
      </div>
    </div>
  );
}

export default Member;
