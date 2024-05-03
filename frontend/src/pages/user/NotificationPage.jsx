import { useEffect, useState } from "react";
import Button from "../../components/Button";
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
      const response = await fetch(`${API_BASE_URL}/api/notification/user/${userId}`);
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
      console.error('Error fetching notifications:', error);
    }
  }

  useEffect(() => {
    if (!isLoading && (!isLoggedIn || user._id !== userId)) {
      // if the user is not logged in, or logged in but not the user ID to be viewed
      // then he/she should be redirected to the home page
      navigate('/');
    }
    fetchNotification();
  }, [user]);

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <img src="/image/Spinner.svg" alt="Loading..." />
      </div>
    );
  } 
  
  return (
    <div className="w-4/5 mt-2 mx-4 p-4">
      <div className="text-3xl pb-10">Notification</div>
      <div>
        {notifications.length === 0 ? <p>No notifications found.</p> : null}
        {notifications.map((notification, idx) =>
          notification.senderId ? ( // check if senderId is not null
            <SingleNotification key={idx} notification={notification} />
          ) : null
        )}
      </div>
    </div>
  );
}
export default NotificationPage;

function SingleNotification({ notification, idx }) {
  function notificationTypeDesc(type) {
    switch (type) {
      case "join_request_accepted":
        return "approved your application to:";
      case "group_closed":
        return "closed a group:";
      case "join_request_rejected":
        return "rejected your application to:";
      case "group_started":
        return "";
      case "new_applicant":
        return `applied to join your group: ${notification.groupId.groupName}`;
      case "member_quit":
        return "quit the group:";
      case "group_closed":
        return "closed the group:";
      case "group_dismissed":
        return "dismissed the group:";
      case "group_dismissed":
      case "delete_member":
        return "removed you from:";
        case "group_updated":
          return "updated the group:";
      default:
        return "Said:";
    }
  }

  async function setRead(notificationId) {
    await fetch(
      `${API_BASE_URL}/api/notification/${notificationId}/read`,
      { method: "PATCH" }
    ).then();
  }

  async function handleInspect() {
    await fetch(`${API_BASE_URL}/api/notification/${notification._id}/read`, {
      method: "PATCH",
    });
  }

  return (
    <div
      className={`flex justify-between py-2${idx === 0 ? "" : " border-t-2 border-t-hmblue-700"
        }`}
    >
      {/* avatar */}
      <div className="flex-shrink-0 w-10 h-10 rounded-full mt-1 overflow-hidden border border-hmblue-500">
        <Link to={`/user/profile/${notification.senderId._id}`}>
          <img src={notification.senderId.avatar} />
        </Link>
      </div>
      <div
        className={`flex-grow ml-3${notification.isRead === true ? " text-gray-400" : ""
          }`}
      >
        {/* notification title */}
        <div className="font-bold text-lg ">
          {notification.senderId.name}{" "}
          {notificationTypeDesc(notification.notificationType)}
        </div>
        {/* notification detail */}
        <div className="mt-1">{notification.notificationContent}</div>
        <div className="mt-1 text-xs text-gray-400">{notification.notificationTime}</div>
      </div>
      <div className="mt-1">
        <Link to={`/group/${notification.groupId._id}`}>
          <Button onClick={handleInspect}>Inspect</Button>
        </Link>
      </div>
    </div>
  );
}
