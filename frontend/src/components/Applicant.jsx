import React, { useState } from "react";
import Button from "./Button";
import axios from "axios";
import { Link } from "react-router-dom";
import { useAuth } from "../store/AuthContext";

function Applicant({
  username,
  message = "",
  avatar,
  isHost,
  applicationId,
  userId,
  onApplicationHandled,
  onMemberHandler,
}) {
  const [hover, setHover] = useState(false);
  const { updateAuth } = useAuth();
  const isLongMessage = message.length > 50;
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  const handleAccept = async () => {
    try {
      const response = await axios.patch(
        `${apiBaseUrl}/api/application/applications-with-details/${applicationId}`,
        {
          applicationStatus: "accepted",
        }
      );
      onApplicationHandled(applicationId);
      onMemberHandler(applicationId, "add");
      updateAuth();
    } catch (error) {
      alert(
        "Failed to accept application: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  const handleReject = async () => {
    try {
      const response = await axios.patch(
        `${apiBaseUrl}/api/application/applications-with-details/${applicationId}`,
        {
          applicationStatus: "rejected",
        }
      );
      onApplicationHandled(applicationId);
      updateAuth();
    } catch (error) {
      console.log("Error caught:", error);
      alert(
        "Failed to reject application: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  return (
    <div
      className="flex flex-col items-center justify-between py-6 px-4 bg-gradient-to-br from-bg1 to-bg2 rounded-lg overflow-hidden mb-14 transition-all duration-500 ease-in-out relative"
      style={{ minWidth: "240px", minHeight: "300px" , maxWidth: "240px", maxHeight: "300px" }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div className="flex-shrink overflow-hidden">
        <div
          className={`flex justify-start items-center ${
            hover && isLongMessage ? "flex-row" : "flex-col"
          }`}
        >
          <Link to={`/user/profile/${userId}`}>
            <img
              src={avatar}
              alt="avatar"
              className={`rounded-full transition-transform duration-300 ease-in-out ${
                hover && isLongMessage ? "w-12 h-12" : "w-24 h-24"
              }`}
            />
          </Link>
          <Link to={`/user/profile/${userId}`}>
            <div
              className={`mt-2 text-xl transition-transform duration-300 ease-in-out ${
                hover && isLongMessage ? "translate-x-2" : ""
              }`}
            >
              {username}
            </div>
          </Link>
        </div>
        <div
          className={`h-full my-2 text-center overflow-auto ${
            hover && isLongMessage
              ? "overflow-auto  hide-scrollbar"
              : " overflow-hidden"
          }`}
        >
          <div className="text-sm text-gray-600">{message}</div>
        </div>
      </div>
      {isHost && (
        <div className=" flex flex-row justify-between grow-0 shrink-0 mt-2 gap-5 ">
          <Button
            onClick={handleAccept}
            className="w-20 h-9 py-1 px-0"
            style_type="fill"
          >
            Allow
          </Button>
          <Button
            onClick={handleReject}
            className="w-20 h-9 py-1 px-0 border-none bg-slate-400 hover:bg-slate-700 text-slate-900"
          >
            Reject
          </Button>
        </div>
      )}
    </div>
  );
}

export default Applicant;
