import Button from "../components/Button";

function NotificationPage() {
  const notifications = dummynotifications;
  return (
    <div className="w-4/5 m-auto ">
      <div className="leading-7 text-3xl mb-10">Notification</div>
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
  return (
    <div
      className={`flex justify-between py-2${
        idx === 0 ? "" : " border-t-2 border-t-hmblue-700"
      }`}
    >
      {/* avatar */}
      <div className="w-10 h-10 rounded-full bg-gray-400 mt-1"></div>
      <div
        className={`flex-grow ml-3${
          notification.isRead === "true" ? " text-gray-400" : ""
        }`}
      >
        {/* notification title */}
        <div className="font-bold text-lg ">
          {notification.from} {notification.description}
        </div>
        {/* notification detail */}
        <div className="mt-1">{notification.detail}</div>
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
    detail: "NO, don't choose INFOSYS730,",
    isRead: "false",
  },
  {
    photoUrl: "",
    from: "Chelsea",
    type: "approve",
    description: "approve your application to:",
    detail: "Looking for INFOSYS730 teamates.",
    isRead: "false",
  },
  {
    photoUrl: "",
    from: "Jennie",
    type: "request",
    description: "send you a request for joining:",
    detail: "Looking for INFOSYS730 teamates.",
    isRead: "true",
  },
  {
    photoUrl: "",
    from: "Jennie",
    type: "close",
    description: "closed a group:",
    detail: "Looking for INFOSYS730 teamates.",
    isRead: "true",
  },
];
