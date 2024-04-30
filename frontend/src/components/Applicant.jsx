
import React, { useState } from "react";
import Button from "./Button";
import axios from "axios";
import { Link } from "react-router-dom";

function Applicant({
  username,
  message = "",
  avatar,
  isHost,
  applicationId,
  userId,
  onApplicationHandled,
}) {

  const [hover, setHover] = useState(false);
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
      alert("Application accepted successfully!");
      onApplicationHandled(applicationId, "accepted");
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
      alert("Application rejected successfully!");
      onApplicationHandled(applicationId, "rejected");
    } catch (error) {
      console.log('Error caught:', error);
      alert(
        "Failed to reject application: " +
        (error.response?.data?.message || error.message)
      );

    }
  };

  return (
    <div className="flex flex-col items-center justify-between py-6 px-4 bg-gradient-to-br from-blue-100 to-blue-300 rounded-lg overflow-hidden m-2 transition-all duration-300 ease-in-out relative" style={{ width: '240px', height: '300px' }}
      onMouseEnter={() => setHover(true)}

      onMouseLeave={() => setHover(false)}
    >
      <div className="flex-shrink overflow-hidden">
        <div
          className={`flex justify-start items-center ${hover && isLongMessage ? "flex-row" : "flex-col"
            }`}
        >
          <Link to={`/user/profile/${userId}`}>

            <img
              src={avatar}
              alt="avatar"
              className={`rounded-full transition-transform duration-300 ease-in-out ${hover && isLongMessage ? "w-12 h-12" : "w-24 h-24"
                }`}
            />
          </Link>
          <Link to={`/user/profile/${userId}`}>

            <div
              className={`mt-2 text-xl transition-transform duration-300 ease-in-out ${hover && isLongMessage ? "translate-x-2" : ""
                }`}
            >
              {username}
            </div>
          </Link>
        </div>

        <div
          className={`h-full my-2 text-center overflow-auto cursor-pointer ${hover && isLongMessage
              ? "overflow-auto  hide-scrollbar"
              : " overflow-hidden"
            }`}
        >

          <div className="text-sm text-gray-600">{message}</div>
        </div>
      </div>

      {isHost && (
        <div className="absolute bottom-4 left-0 right-0 px-4 flex justify-between">
          <Button onClick={handleAccept} className="w-20 py-1 px-0" style_type="fill">Allow</Button>
          <Button onClick={handleReject} className="w-20 py-1 px-0" style_type="border">Reject</Button>
        </div>
      )}
    </div>
  );
}

export default Applicant;
