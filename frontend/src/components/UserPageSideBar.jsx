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
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isShowSideBar, setIsShowSideBar] = useState(false);

  let unReadNotiNum = 0;
  if (loggedInUser !== null) {
    unReadNotiNum = loggedInUser.unreadMessages || 0;
  }

  useEffect(() => {
    if (!isLoggedIn || loggedInUser?._id !== userId) {
      // Fetch user data from API if not logged in or viewing another user's profile
      axios
        .get(`${import.meta.env.VITE_API_BASE_URL}/api/user/userData/${userId}`)
        .then((response) => {
          setUser(response.data);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
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
    },
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
        unread: unReadNotiNum,
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
    <>
      {/* show sidebar btn */}
      <div
        className={`text-white font-bold rounded-r-md flex justify-end bg-hmblue-700 fixed w-12 mt-1 py-1 left-0 top-16 items-center md:hidden cursor-pointer ${
          isShowSideBar ? "hidden" : ""
        }`}
        onClick={() => {
          setIsShowSideBar(true);
        }}
      >
        <span className="flex w-4 h-4 border-y-2 mr-2 relative items-center">
          <span className="w-full border-t-2"></span>
        </span>
      </div>
      {/* mask */}
      {isShowSideBar ? (
        <div className="w-full h-full fixed bg-gray-900/50 z-[999]"></div>
      ) : (
        ""
      )}
      {/* sidebar */}
      <div
        className={`w-4/5 md:w-sideBarWidth min-w-sideBarWidth overflow-y-auto bg-primary flex flex-col items-center z-[1000] min-h-[calc(100vh-theme(spacing.navHeight))] absolute transition-all md:static ${
          isShowSideBar ? "" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* close sidebar btn */}
        <div
          className="absolute text-white text-4xl right-0 cursor-pointer py-4 px-6 md:hidden"
          onClick={() => {
            setIsShowSideBar(false);
          }}
        >
          ×
        </div>
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
        <div className="w-full ">
          {options.map((option) => (
            <SidebarOption
              option={option}
              key={option.label}
              isActive={location.pathname === option.to}
              hideSelf={() => {
                setIsShowSideBar(false);
              }}
            />
          ))}
        </div>
      </div>
    </>
  );
}

function SidebarOption({ option, isActive, hideSelf }) {
  const activeClass = isActive ? "bg-secondary" : "";
  return (
    <Link
      to={option.to}
      className={`p-3 pl-9 flex items-center justify-start hover:bg-secondary text-white cursor-pointer ${activeClass} transition-colors duration-100 w-full`}
      onClick={hideSelf}
    >
      {option.icon}
      {option.label}
      {option.label === "Notification" ? (
        option.unread == 0 ? (
          ""
        ) : (
          <span className="w-5 h-5 inline-block text-sm rounded-full bg-red-700 text-center ml-2">
            {option.unread > 99 ? "99+" : option.unread}
          </span>
        )
      ) : (
        ""
      )}
    </Link>
  );
}

export default UserPageSideBar;
export { SidebarOption };
