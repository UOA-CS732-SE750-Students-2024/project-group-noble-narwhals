import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Button from "./Button";
import { IoAdd } from "react-icons/io5";
import { IoMdNotificationsOutline } from "react-icons/io";
import { IoSearchOutline } from "react-icons/io5";
import { BsChevronCompactRight } from "react-icons/bs";

function Navbar({ isLogged = false, user = {} }) {
  const location = useLocation();
  let darkMode = location.pathname.startsWith("/search");

  const [showMenu, setShowMenu] = useState(false);
  const switchMenu = () => {
    setShowMenu((preState) => !preState);
  };

  return (
    <>
      <nav
        id="nav_bar"
        className={`shadow-sm fixed  left-0 top-0 w-screen ${
          darkMode ? "text-white bg-primary " : "bg-white text-primary"
        } `}
      >
        <div className="mx-auto w-full h-navHeight px-12">
          <div
            id="nav_content"
            className="flex flex-row justify-between items-center h-full w-full"
          >
            <Link to="/" className="flex flex-row gap-2 items-center">
              <img
                src="/image/logo.png"
                alt="logo"
                className="h-11 rounded-lg"
              />
              {darkMode ? (
                <img src="/image/brand_blue.png" alt="logo" className="h-11" />
              ) : (
                <img src="/image/brand_white.png" alt="logo" className="h-11" />
              )}
            </Link>

            {!isLogged && (
              <div className="flex flex-row gap-4">
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

            {isLogged && (
              <div className="flex flex-row gap-7 items-center">
                <div
                  className={`flex flex-row items-center justify-between border-2 rounded-full pr-0.5 pl-4 bg-white hover:border-primary focus-within:border-primary ${
                    darkMode &&
                    "border-white hover:border-white focus-within:border-white focus-within:text-primary"
                  }  `}
                >
                  <input
                    type="text"
                    placeholder="Search"
                    className={`w-72 h-8 outline-none transition-all duration-300 `}
                  />
                  <div
                    className={` w-7 h-7 rounded-full hover:bg-gray-200 flex items-center justify-center ${
                      darkMode && "text-primary"
                    } z-10`}
                  >
                    <IoSearchOutline />
                  </div>
                </div>
                <div
                  className={`h-9 flex flex-row items-center gap-1 cursor-pointer hover:bg-gray-200 py-1 px-2 rounded-full ${
                    darkMode ? "hover:text-primary" : ""
                  }`}
                >
                  <Link
                    to="/"
                    className={`text-xl flex flex-row items-center justify-center `}
                  >
                    <IoAdd />
                  </Link>
                  <span>Create Group</span>
                </div>
                <div
                  className={`h-9 flex flex-row items-center gap-1 cursor-pointer hover:bg-gray-200 py-1 px-2 rounded-full ${
                    darkMode ? "hover:text-primary" : ""
                  }`}
                >
                  <Link
                    to="/"
                    className={`text-xl flex flex-row items-center justify-center `}
                  >
                    <IoMdNotificationsOutline />
                  </Link>
                  <span>Notifications</span>
                </div>
                <div
                  onClick={switchMenu}
                  className="h-9 relative flex flex-row items-center gap-2 cursor-pointer hover:bg-gray-200 pr-3 rounded-full "
                >
                  <img
                    src="/image/logo.png"
                    alt="Avator"
                    className="h-10 rounded-full "
                  />
                  Username
                  {showMenu && (
                    <div
                      className={`bg-white absolute top-11 -right-6 w-48 rounded-xl flex flex-col items-center p-1 pb-3 gap-3 shadow-basic ${
                        darkMode && "text-primary"
                      }`}
                    >
                      <div className="flex flex-row justify-around items-center w-full h-10 hover:bg-gray-200 rounded-lg cursor-pointer">
                        <span>Your profile</span>
                        <BsChevronCompactRight className="w-6 h-6 text-lg font-extrabold" />
                      </div>
                      <Button className="border-1 h-9 ">
                        <Link to="/">Log out</Link>
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
