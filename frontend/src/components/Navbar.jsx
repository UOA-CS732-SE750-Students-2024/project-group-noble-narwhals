import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Button from "./Button";
import { IoAdd } from "react-icons/io5";
import { IoMdNotificationsOutline } from "react-icons/io";
import { IoSearchOutline } from "react-icons/io5";
import { BsChevronCompactRight } from "react-icons/bs";
import { useAuth } from "../store/AuthContext";
import axios from "axios";

function Navbar() {
  const inputRef = useRef();
  const navigate = useNavigate();
  const { isLoggedIn, user, setIsLoggedIn, setUser } = useAuth();
  const [showSearch, setShowSearch] = useState(true);
  const location = useLocation();
  let darkMode = location.pathname.startsWith("/search");

  const logoutHandler = () => {
    setUser(null);
    setIsLoggedIn(false);
    navigate("/");
    window.localStorage.setItem("isLoggedIn", false);
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/auth/logout`, {
        withCredentials: true,
      })
      .then(() => {});
  };

  const [showMenu, setShowMenu] = useState(false);
  const switchMenu = () => {
    setShowMenu((preState) => !preState);
  };

  const searchHandler = (e) => {
    e.preventDefault();
    const word = inputRef.current.value;
    inputRef.current.value = "";
    navigate(`/search`, { state: { keywords: word } });
  };

  useEffect(() => {
    const handleScroll = () => {
      const checkPath = location.pathname === "/";
      if (location.pathname === "/search") {
        setShowSearch(false);
      } else {
        const visible = window.scrollY < 320;
        setShowSearch(!(visible && checkPath));
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [location]);

  return (
    <>
      <nav
        id="nav_bar"
        className={`shadow-sm fixed z-50 left-0 top-0 w-screen ${
          darkMode ? "text-white bg-primary " : "bg-white text-primary"
        } `}
      >
        <div className="mx-auto w-full h-navHeight px-5 md:px-12">
          <div
            id="nav_content"
            className="flex flex-row justify-between items-center h-full w-full gap-2"
          >
            <Link
              to="/"
              className="flex flex-row gap-2 items-center shrink-0 grow-0"
            >
              <img
                src="/image/logo.png"
                alt="logo"
                className="h-11 rounded-lg w-full"
              />
              {darkMode ? (
                <img
                  src="/image/brand_blue.png"
                  alt="logo"
                  className="h-11  w-full hidden md:block"
                />
              ) : (
                <img
                  src="/image/brand_white.png"
                  alt="logo"
                  className="h-11 w-full hidden md:block"
                />
              )}
            </Link>

            {!isLoggedIn && (
              <div className="flex flex-row gap-7 items-center">
                {showSearch && (
                  <div
                    id="nav_search_bar"
                    className={`flex flex-row items-center justify-between border-2 rounded-full pr-0.5 pl-4 bg-white hover:border-primary focus-within:border-primary ${
                      darkMode &&
                      "border-white hover:border-white focus-within:border-white focus-within:text-primary"
                    }  `}
                  >
                    <input
                      ref={inputRef}
                      type="text"
                      placeholder="Search"
                      className={`w-full lg:w-72 h-8 outline-none transition-all duration-300 `}
                    />
                    <div
                      className={`w-7 h-7 rounded-full hover:bg-gray-200 flex items-center justify-center ${
                        darkMode && "text-primary"
                      } z-10`}
                      onClick={searchHandler}
                    >
                      <IoSearchOutline />
                    </div>
                  </div>
                )}
                <Link to="/login">
                  <Button
                    className={`${
                      darkMode && "bg-white hover:text-white border-white"
                    }`}
                  >
                    Log in
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button
                    style_type="fill"
                    className={`${
                      darkMode && "border-2  border-white hover:border-pink-600"
                    }`}
                  >
                    Sign up
                  </Button>
                </Link>
              </div>
            )}

            {isLoggedIn && (
              <div className="flex flex-row gap-7 items-center">
                {showSearch && (
                  <div
                    id="nav_search_bar"
                    className={`flex flex-row items-center justify-between border-2 rounded-full pr-0.5 pl-4 bg-white hover:border-primary focus-within:border-primary ${
                      darkMode &&
                      "border-white hover:border-white focus-within:border-white focus-within:text-primary"
                    }  `}
                  >
                    <input
                      ref={inputRef}
                      type="text"
                      placeholder="Search"
                      className={`w-full lg:w-60  h-8 outline-none transition-all duration-300 `}
                    />
                    <div
                      className={` w-7 h-7 rounded-full hover:bg-gray-200 flex items-center justify-center ${
                        darkMode && "text-primary"
                      } z-10`}
                      onClick={searchHandler}
                    >
                      <IoSearchOutline />
                    </div>
                  </div>
                )}

                <div
                  className={`h-9 flex flex-row items-center gap-1 cursor-pointer hover:bg-gray-200 py-1 px-2 rounded-full ${
                    darkMode ? "hover:text-primary" : ""
                  }`}
                >
                  <Link
                    to="/creategroup"
                    className={`text-xl flex flex-row items-center justify-center gap-1 `}
                  >
                    <IoAdd />
                    <span className="hidden lg:block">Create Group</span>
                  </Link>
                </div>
                <div
                  className={`h-9 flex flex-row items-center gap-1 cursor-pointer hover:bg-gray-200 py-1 px-2 rounded-full ${
                    darkMode ? "hover:text-primary" : ""
                  }`}
                >
                  <Link
                    to={`/user/notification/${user._id}`}
                    className={`text-xl flex flex-row items-center justify-center gap-1 relative `}
                  >
                    <IoMdNotificationsOutline />
                    <span className="hidden lg:block">Notifications</span>
                    {user.unreadMessages ? (
                      <span className=" rounded-full w-5 h-5 text-white bg-gray-500 flex items-center justify-center text-xs">
                        {user.unreadMessages}
                      </span>
                    ) : null}
                  </Link>
                </div>
                <div
                  onClick={switchMenu}
                  className={`h-9 relative flex flex-row items-center gap-2 cursor-pointer hover:bg-gray-200 pr-3 rounded-full ${
                    darkMode ? "hover:text-primary" : ""
                  }`}
                >
                  <img
                    src={user.avatar}
                    alt="Avator"
                    className="h-10 rounded-full "
                  />
                  <span >{user.name}</span>
                  {showMenu && (
                    <div
                      className={`bg-white absolute top-11 -right-6 w-48 rounded-xl flex flex-col items-center p-1 pb-3 gap-3 shadow-basic ${
                        darkMode && "text-primary"
                      }`}
                    >
                      <Link
                        to={`/user/profile/${user._id}`}
                        className="flex flex-row justify-around items-center w-full h-10 hover:bg-gray-200 rounded-lg cursor-pointer"
                      >
                        <span>My profile</span>
                        <BsChevronCompactRight className="w-6 h-6 text-lg font-extrabold" />
                      </Link>
                      <Button onClick={logoutHandler} className="border-1 h-9 ">
                        Log out
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>
      <div id="nav_behind" className="h-navHeight w-full"></div>
    </>
  );
}

export default Navbar;
