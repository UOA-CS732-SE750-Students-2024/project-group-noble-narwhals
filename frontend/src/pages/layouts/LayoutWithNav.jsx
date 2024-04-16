import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../../components/Navbar";

export default function PageLayout() {
  return (
    <>
      <Navbar isLogged={false} />
      <div id="main_content" className="w-4/5 max-w-mainContent mx-auto">
        <Outlet />
      </div>
    </>
  );
}
