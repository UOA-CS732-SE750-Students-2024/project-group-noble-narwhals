import { useEffect, useState } from "react";
import { useAuth } from "../../store/AuthContext";
import { Link, useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

function NotificationPage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user, setUser, isLoading, setIsLoading, isLoggedIn } = useAuth();
  const [notifications, setNotifications] = useState([]);

  /**
   * get all notifications
   */
  async function fetchNotification() {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/notification/user/${userId}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      let notifications = await response.json();

      // sort notifications by time
      notifications.sort((a, b) => {
        return new Date(b.notificationTime) - new Date(a.notificationTime);
      });
      setNotifications(notifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  }

  useEffect(() => {
    if (!isLoading && (!isLoggedIn || user._id !== userId)) {
      // if the user is not logged in, or logged in but not the user ID to be viewed
      // then he/she should be redirected to the home page
      navigate("/");
    }
    fetchNotification();
  }, [user]);

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <img src="/image/Spinner.svg" alt="Loading..." />
      </div>
    );
  }

  return (
    <div className="flex flex-col m-4 p-4">
      <div className="text-3xl mb-8">Notification</div>
      <div>
        {notifications.length === 0 ? <p>No notifications found.</p> : null}
        {notifications.map((notification, idx) =>
          notification.senderId ? ( // check if senderId is not null
            <SingleNotification
              key={idx}
              notification={notification}
              idx={idx}
            />
          ) : null
        )}
      </div>
    </div>
  );
}
export default NotificationPage;

function SingleNotification({ notification, idx }) {
  const {  setUser } = useAuth();
  const navigate = useNavigate();
  function notificationTypeDesc(type) {
    switch (type) {
      case "join_request_accepted":
        return "approved your application to:";
      case "join_request_rejected":
        return "rejected your application to:";
      case "group_started":
        return "";
      case "new_applicant":
        return `applied to join your group: ${notification == null ? notification.groupId.groupName : ""}`;
      case "member_quit":
        return "quit the group:";
      case "group_closed":
        return "closed the group:";
      case "group_dismissed":
        return "dismissed the group:";
      case "delete_member":
        return "removed you from:";
      case "group_updated":
        return "updated the group:";
      default:
        return "Said:";
    }
  }

  async function notificationClickHandler(notificationId, groupId) {

    await fetch(`${API_BASE_URL}/api/notification/${notificationId}/read`, {
      method: "PATCH",
    }).then(() => {
      navigate(`/group/${groupId._id}`);
      setUser((prev) => {
        return { ...prev, unreadMessages: prev.unreadMessages - 1 };
      });
    });
  }

  return (
    <div
      className={`flex w-[90%] justify-between py-2${
        idx === 0 ? " border-t-2 border-t-hmblue-700" : ""
      } border-b-2 border-b-hmblue-700`}
    >
      {/* avatar */}
      <div className="flex-shrink-0 w-10 h-10 rounded-full mt-1 overflow-hidden border border-hmblue-500">
        <Link to={`/user/profile/${notification.senderId._id}`}>
          <img src={notification.senderId.avatar} />
        </Link>
      </div>
      {/* content */}
      <div
        className={`group flex flex-row flex-grow ml-3 cursor-pointer${
          notification.isRead == true ? " text-gray-400" : ""
        }`}
        onClick={() => {
          notificationClickHandler(notification._id, notification.groupId);
        }}
      >
        <div className="flex-grow">
          {/* notification title */}
          <div className="font-bold text-lg group-hover:underline">
            {notification.senderId.name}{" "}
            {notificationTypeDesc(notification.notificationType)}
          </div>
          {/* notification detail */}
          <div className="group-hover:underline">
            {notification.notificationContent}
          </div>
          <div className="text-xs text-gray-400 group-hover:underline">
            {new Date(notification.notificationTime).toLocaleString("en-NZ", {
              timeZone: "UTC",
            })}
          </div>
        </div>
        <div className="flex items-center">
          <span className="mr-4 text-hmblue-700 invisible group-hover:visible">
            &gt;&gt;&gt;
          </span>
        </div>
      </div>
    </div>
  );
}
