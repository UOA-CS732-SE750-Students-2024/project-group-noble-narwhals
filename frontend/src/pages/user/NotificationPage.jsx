import { useEffect, useState } from "react";
import Button from "../../components/Button";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

function NotificationPage() {
  const [notifications, setNotifications] = useState([]);

  /**
   * get all notifications
   */
  async function fetchNotification() {
    try {
      await fetch(
        `${API_BASE_URL}/api/notification/user/660624d75d210ffadab318bc`
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
    fetchNotification();
  }, []);
  return (
    <div className="w-4/5 mx-auto p-4">
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
      default:
        return "Said:";
    }
  }

  async function setRead(notificationId) {
    await fetch(
      `${API_BASE_URL}/api/notification/user/660624d75d210ffadab318bc/read`,
      { method: "PATCH" }
    ).then();
  }
  return (
    <div
      className={`flex justify-between py-2${
        idx === 0 ? "" : " border-t-2 border-t-hmblue-700"
      }`}
    >
      {/* avatar */}
      <div className="w-10 h-10 rounded-full mt-1 overflow-hidden border border-hmblue-500">
        <img src={notification.senderId.avatar} />
      </div>
      <div
        className={`flex-grow ml-3${
          notification.isRead === "true" ? " text-gray-400" : ""
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

const dummynotifications = [
  {
    photoUrl: "",
    from: "Chelsea",
    type: "reply",
    description: "reply you:",
    notificationContent: "NO, don't choose INFOSYS730,",
    isRead: "false",
  },
  {
    photoUrl: "",
    from: "Chelsea",
    type: "approve",
    description: "approve your application to:",
    notificationContent: "Looking for INFOSYS730 teamates.",
    isRead: "false",
  },
  {
    photoUrl: "",
    from: "Jennie",
    type: "request",
    description: "send you a request for joining:",
    notificationContent: "Looking for INFOSYS730 teamates.",
    isRead: "true",
  },
  {
    photoUrl: "",
    from: "Jennie",
    type: "close",
    description: "closed a group:",
    notificationContent: "Looking for INFOSYS730 teamates.",
    isRead: "true",
  },
];
