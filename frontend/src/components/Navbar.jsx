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
    <nav
      className={`shadow-sm ${
        darkMode ? "text-white bg-primary " : "text-primary"
      } `}
    >
      <div className="mx-auto w-4/5 max-w-main_content h-nav_height ">
        <div
          id="nav_content"
          className="flex flex-row justify-between items-center h-full w-full"
        >
          <Link to="/" className="flex flex-row gap-2 items-center">
            <img src="logo.png" alt="logo" className="h-11 rounded-lg" />
            {/* <div className="text-xl">Hey Mate</div> */}
            {darkMode ? (
              <img src="brand_blue.png" alt="logo" className="h-11" />
            ) : (
              <img src="brand_white.png" alt="logo" className="h-11" />
            )}
            {/* <img src="brand_white.png" alt="logo" className="h-11" /> */}
          </Link>

          {!isLogged && (
            <div className="flex flex-row gap-4">
              <Button
                className={`${
                  darkMode && "bg-white hover:text-white border-white"
                }`}
              >
                Login
              </Button>
              <Button
                style_type="fill"
                className={`${
                  darkMode && "border-2  border-white hover:border-pink-600"
                }`}
              >
                Sign up
              </Button>
            </div>
          )}

          {isLogged && (
            <div className="flex flex-row gap-5 items-center">
              <div
                className={`flex flex-row items-center border-2 rounded-full pr-1 pl-4 bg-white focus-within:border-primary ${
                  darkMode &&
                  "border-white focus-within:border-white focus-within:text-primary"
                }  `}
              >
                <input
                  type="text"
                  placeholder="Search"
                  className={` w-14 h-8 outline-none focus:w-48 transition-all duration-300 `}
                />
                <div
                  className={` w-8 h-7 rounded-full hover:bg-gray-200 flex items-center justify-center ${
                    darkMode && "text-primary"
                  }`}
                >
                  <IoSearchOutline />
                </div>
              </div>
              <div
                className={`w-7 h-7 text-xl rounded-sm flex flex-row items-center justify-center cursor-pointer hover:bg-gray-200 ${
                  darkMode ? "hover:text-primary" : ""
                }   `}
              >
                <Link to="/">
                  <IoAdd />
                </Link>
              </div>
              <div
                className={`w-7 h-7  text-xl rounded-sm flex flex-row items-center justify-center hover:bg-gray-200 cursor-pointer ${
                  darkMode ? "hover:text-primary" : ""
                } `}
              >
                <IoMdNotificationsOutline />
              </div>
              <div onClick={switchMenu} className="relative">
                <img
                  src="logo.png"
                  alt="Avator"
                  className="h-10 rounded-full cursor-pointer "
                />
                {showMenu && (
                  <div
                    className={`bg-white absolute top-11 -right-6 w-48 rounded-xl flex flex-col items-center p-1 pb-3 gap-3 shadow-basic ${
                      darkMode && "text-primary"
                    } z-10`}
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
  );
}

export default Navbar;
