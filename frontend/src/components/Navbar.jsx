import React from "react";
import { Link } from "react-router-dom";
import Button from "./Button";
import { IoAdd } from "react-icons/io5";
import { IoMdNotificationsOutline } from "react-icons/io";
import { IoSearchOutline } from "react-icons/io5";

function Navbar({ darkMode = false, isLogged = false, user = {} }) {
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
          <Link to="/" className="flex flex-row gap-4 items-center">
            <img src="logo.png" alt="logo" className="h-10 rounded-full" />
            <div className="text-xl">Hey Mate</div>
          </Link>

          {!isLogged && (
            <div className="flex flex-row gap-4">
              <Button className={`${ darkMode && 'bg-white hover:text-white border-white'}`}>Login</Button>
              <Button style_type="fill" className={`${ darkMode && 'border-2  border-white hover:border-pink-600'}`} >Sign up</Button>
            </div>
          )}

          {isLogged && (
            <div className="flex flex-row gap-5 items-center">
              <div className={`flex flex-row items-center border-2 rounded-full pr-1 pl-4 bg-white focus-within:border-primary ${darkMode && 'border-white focus-within:border-white focus-within:text-primary'}  `}>
                <input
                  type="text"
                  placeholder="Search"
                  className={` w-28 h-8 outline-none focus:w-48 transition-all duration-300 `}
                />
                <div className={` w-8 h-7 rounded-full hover:bg-gray-200 flex items-center justify-center ${darkMode && 'text-primary'}`}>
                  <IoSearchOutline />
                </div>
              </div>
              <div
                className={`w-7 h-7  text-xl rounded-sm flex flex-row items-center justify-center cursor-pointer  hover:bg-gray-200 ${
                  darkMode ? "hover:text-primary" : ""
                }   `}
              >
                <IoAdd />
              </div>
              <div
                className={`w-7 h-7  text-xl rounded-sm flex flex-row items-center justify-center hover:bg-gray-200 cursor-pointer ${
                  darkMode ? "hover:text-primary" : ""
                } `}
              >
                <IoMdNotificationsOutline />
              </div>
              <div>
                <img
                  src="logo.png"
                  alt="Avator"
                  className="h-10 rounded-full cursor-pointer"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
