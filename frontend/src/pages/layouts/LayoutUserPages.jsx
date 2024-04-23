import React from "react";
import { Outlet } from "react-router-dom";
import UserPageSideBar from "../../components/UserPageSideBar.jsx";
import Navbar from "../../components/Navbar.jsx";

export default function LayoutUserPages() {
  return (
    <>
      <Navbar  />
      <div className="overflow-y-auto">
        <div className="flex overflow-y-auto min-h-[calc(100vh-theme(spacing.navHeight))]">
          {/**May delete the "pt-10" after adding a placeholder to the nav bar */}
          <UserPageSideBar />
          <div className="flex-grow">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
}
