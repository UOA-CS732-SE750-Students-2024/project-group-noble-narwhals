import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function PageLayout() {
  return (
    <>
      <Navbar />
      <div id="main_content" className="w-full px-3 md:px-0 md:w-5/6 lg:w-4/5 max-w-mainContent mx-auto">
        <Outlet />
      </div>
      <Footer />
    </>
  );
}
