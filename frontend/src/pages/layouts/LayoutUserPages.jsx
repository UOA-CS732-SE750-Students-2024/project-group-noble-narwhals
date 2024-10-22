import React from "react";
import { Outlet } from "react-router-dom";
import UserPageSideBar from "../../components/UserPageSideBar.jsx";
import Navbar from "../../components/Navbar.jsx";

// import { UserProvider } from "../../contexts/UserContext.jsx";
import { AuthProvider } from "../../store/AuthContext.jsx";

export default function LayoutUserPages() {
  return (
    <>
      {/* <AuthProvider> */}
      <Navbar />
      {/* <UserProvider> */}
      <div className="">
        <div className="flex">
          {" "}
          {/**May delete the "pt-10" after adding a placeholder to the nav bar */}
          <UserPageSideBar />
          <div className="flex-grow md:px-10">
            <Outlet />
          </div>
        </div>
      </div>
      {/* </AuthProvider> */}
      {/* </UserProvider> */}
    </>
  );
}
