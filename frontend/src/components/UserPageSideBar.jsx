import React, { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { CgProfile } from "react-icons/cg";
import { IoSettingsSharp } from "react-icons/io5";
import { MdPendingActions } from "react-icons/md";
import { FaHeart } from "react-icons/fa";
import { IoIosNotifications } from "react-icons/io";
import { useUser } from "../contexts/UserContext";

function UserPageSideBar() {
  const [selectedOption, setSelectedOption] = useState("");
  const [isOwner, setIsOwner] = useState(true);
  const { user, error, isLoggedIn } = useUser();
  const location = useLocation();
  const { userId } = useParams();

  if (error) {
    return <div>Error fetching data: {error.message}</div>;
  }

  // if user is not found (is null)
  if (!user) {
    return <div>User not found</div>;
  }

  const handleOptionClick = (option) => {
    setSelectedOption(option);
  };


  const options = isOwner ? [
    {
      label: "Public Profile",
      icon: <CgProfile className="mr-2 w-6 h-6" />,
      to: `/user/profile/${userId}`,
    },
    {
      label: "Account settings",
      icon: <IoSettingsSharp className="mr-2 w-6 h-6" />,
      to: `/user/settings/${userId}`,
    },
    {
      label: "Apply in progress",
      icon: <MdPendingActions className="mr-2 w-6 h-6" />,
      to: `/user/apply-in-progress/${userId}`,
    },
    {
      label: "Liked groups",
      icon: <FaHeart className="mr-2 w-6 h-6" />,
      to: `/user/liked/${userId}`,
    },
    {
      label: "Notification",
      icon: <IoIosNotifications className="mr-2 w-6 h-6" />,
      to: `/user/notification/${userId}`,
    },
  ] : [
    {
      label: "Public Profile",
      icon: <CgProfile className="mr-2 w-6 h-6" />,
      to: `/user/profile/${userId}`,
    }
  ];

  return (
    <div className="w-sideBarWidth min-w-sideBarWidth overflow-y-auto bg-primary flex flex-col items-center ">
      <div>
        {/*users' avatar and username*/}
        <div className="flex flex-col items-center justify-center p-8">
          <img
            className="w-24 h-24 rounded-full mb-2"
            src={user.avatar}
            alt="User Avatar"
          />
          <div>
            <p className="text-xl text-white font-bold">{user.name}</p>
          </div>
        </div>
      </div>
      <div className="w-full">
        {options.map((option) => (
          <SidebarOption
            key={option.label}
            label={option.label}
            icon={option.icon}
            to={option.to}
            isActive={location.pathname === option.to}
            handleClick={handleOptionClick}
          />
        ))}
      </div>
    </div>
  );
}

function SidebarOption({ icon, label, to, handleClick, isActive }) {
  const activeClass = isActive ? "bg-secondary" : "";
  return (
    <div
      className={`p-3 flex items-center justify-center hover:bg-secondary text-white cursor-pointer ${activeClass} transition-colors duration-100`}
  
      onClick={() => handleClick(label)}
    >
      <Link to={to} className="flex items-center w-full justify-start pl-4">
        {icon}
        {label}
      </Link>
    </div>
  );
}

export default UserPageSideBar;
export { SidebarOption };
