import React, { useState } from "react";
import { Link } from "react-router-dom";
import { CgProfile } from "react-icons/cg";
import { IoSettingsSharp } from "react-icons/io5";
import { MdPendingActions } from "react-icons/md";
import { FaHeart } from "react-icons/fa";
import { IoIosNotifications } from "react-icons/io";

function UserPageSideBar() {
  const [selectedOption, setSelectedOption] = useState("");

  const handleOptionClick = (option) => {
    setSelectedOption(option);
  };

  const options = [
    {
      label: "Public Profile",
      icon: <CgProfile className="mr-2 w-6 h-6" />,
      to: "/user/profile",
    },
    {
      label: "Account settings",
      icon: <IoSettingsSharp className="mr-2 w-6 h-6" />,
      to: "/user/settings",
    },
    {
      label: "Apply in progress",
      icon: <MdPendingActions className="mr-2 w-6 h-6" />,
      to: "/user/apply-in-progress",
    },
    {
      label: "Liked groups",
      icon: <FaHeart className="mr-2 w-6 h-6" />,
      to: "/user/liked",
    },
    {
      label: "Notification",
      icon: <IoIosNotifications className="mr-2 w-6 h-6" />,
      to: "/user/notification",
    },
  ];

  return (
    <div className="w-sideBarWidth min-w-sideBarWidth overflow-y-auto bg-primary flex flex-col items-center ">
      <div>
        {/*users' avatar and username*/}
        <div className="flex flex-col items-center justify-center p-8">
          <img
            className="w-24 h-24 rounded-full mb-2"
            src="https://www.animesenpai.net/wp-content/uploads/2022/12/Bocchi-The-Rock-21-1024x576.webp"
            alt="User Avatar"
          />
          <div>
            <p className="text-xl text-white font-bold">Username</p>
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
            handleClick={handleOptionClick}
          />
        ))}
      </div>
    </div>
  );
}

function SidebarOption({ icon, label, to, handleClick }) {
  return (
    <div
      className="p-3 flex items-center justify-center hover:bg-secondary text-white cursor-pointer transition-colors duration-100"
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
