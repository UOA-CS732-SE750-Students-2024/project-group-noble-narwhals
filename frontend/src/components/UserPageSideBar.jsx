import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";
import { CgProfile } from "react-icons/cg";
import { IoSettingsSharp } from "react-icons/io5";
import { MdPendingActions } from "react-icons/md";
import { FaHeart } from "react-icons/fa";
import { IoIosNotifications } from "react-icons/io";
import { useAuth } from "../store/AuthContext";

function UserPageSideBar() {
  const { isLoggedIn, user: loggedInUser } = useAuth();
  const { userId } = useParams();
  const location = useLocation();
  const [selectedOption, setSelectedOption] = useState("");
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn || loggedInUser?._id !== userId) {
      // Fetch user data from API if not logged in or viewing another user's profile
      axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/user/userData/${userId}`)
        .then(response => {
          setUser(response.data);
          setIsLoading(false);
        })
        .catch(error => {
          console.error('Error fetching user data:', error);
          setIsLoading(false);
        });
    } else {
      // Use logged in user data if viewing own profile
      setUser(loggedInUser);
      setIsLoading(false);
    }
  }, [userId, isLoggedIn, loggedInUser]);

  const options = [
    {
      label: "Public Profile",
      icon: <CgProfile className="mr-2 w-6 h-6" />,
      to: `/user/profile/${userId}`,
    }
  ];

  if (isLoggedIn && userId === loggedInUser?._id) {
    // Add more options if the user is logged in and viewing their own profile
    options.push(
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
      }
    );
  }

  if (isLoading) {
    return <div></div>;
  }

  if (!user) {
    return <div></div>;
  }

  return (
    <div className="w-sideBarWidth min-w-sideBarWidth overflow-y-auto bg-primary flex flex-col items-center ">
      <div className="flex flex-col items-center justify-center p-8">
        {user && (
          <>
            <img
              className="w-24 h-24 rounded-full mb-2"
              src={user.avatar}
              alt={`${user.name}'s Avatar`}
            />
            <p className="text-xl text-white font-bold">{user.name}</p>
          </>
        )}
      </div>
      <div className="w-full">
        {options.map((option) => (
          <SidebarOption
            key={option.label}
            label={option.label}
            icon={option.icon}
            to={option.to}
            isActive={location.pathname === option.to}
            handleClick={setSelectedOption}
          />
        ))}
      </div>
    </div>
  );
}

function SidebarOption({ icon, label, to, handleClick, isActive }) {
  const activeClass = isActive ? "bg-secondary" : "";
  return (
      <Link to={to} className={`p-3 pl-4 flex items-center justify-start hover:bg-secondary text-white cursor-pointer ${activeClass} transition-colors duration-100 w-full`}  onClick={() => handleClick(label)}>
        {icon}
        {label}
      </Link>
  );
}

export default UserPageSideBar;
export { SidebarOption };
