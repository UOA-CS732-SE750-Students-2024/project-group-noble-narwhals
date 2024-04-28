import { useEffect, useState } from "react";
import Button from "../../components/Button";
import { useAuth } from "../../store/AuthContext";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

function NotificationPage() {
  const { userId } = useParams();
  console.log("userId from notification: ", userId);
  const navigate = useNavigate();
  const { user, setUser, isLoading, setIsLoading, isLoggedIn } = useAuth();
  const [notifications, setNotifications] = useState([]);


  /**
   * get all notifications
   */
  async function fetchNotification() {
    try {
      
      await fetch(
        `${API_BASE_URL}/api/notification/user/${userId}`
      )
        .then((response) => {
          if (response.status === 200) {
            return response.json();
          } else {
            throw new Error("Fail");
          }
        })
        .then((json) => {
          setNotifications(json);
        });
    } catch (error) {
      return;
    }
  }

  useEffect(() => {
    if (!isLoading && (!isLoggedIn || user._id !== userId)) {
      console.log("user._id is not the owner of this page: ", user._id);
      // if the user is not logged in, or logged in but not the user ID to be viewed
      // then he/she should be redirected to the home page
      navigate('/');
    }
    fetchNotification();
  }, [user]);
  return (
    <div className="w-4/5 mx-4 p-4">
      <div className="text-3xl pb-10">Notification</div>
      <div>
        {notifications.map((notification, idx) => (
          <SingleNotification key={idx} notification={notification} idx={idx} />
        ))}
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
        return "applied to join:";
      case "member_quit":
        return "quit the group:";
      case "group_updated":
        return "closed the group:";
      case "group_dismissed":
        return "dismissed the group:";
      case "group_dismissed":
      case "delete_member":
        return "removed you from:";
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
  return (
    <div
      className={`flex justify-between py-2${idx === 0 ? "" : " border-t-2 border-t-hmblue-700"
        }`}
    >
      {/* avatar */}
      <div className="w-10 h-10 rounded-full mt-1 overflow-hidden border border-hmblue-500">
        <img src={notification.senderId.avatar} />
      </div>
      <div
        className={`flex-grow ml-3${notification.isRead === "true" ? " text-gray-400" : ""
          }`}
      >
        {/* notification title */}
        <div className="font-bold text-lg ">
          {notification.senderId.name}{" "}
          {notificationTypeDesc(notification.notificationType)}
        </div>
        {/* notification detail */}
        <div className="mt-1">{notification.notificationContent}</div>
      </div>
      <div className="mt-1">
        <Button>Inspect</Button>
      </div>
    </div>
  );
}
