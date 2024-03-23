import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { MdFavoriteBorder } from "react-icons/md";


function HomePage() {
  return (
    <>
      <Navbar />
      <div id="main_content" className="mx-auto max-w-main_content">
        <div className="text-3xl">HomePage</div>
        <Link to="/login">Login</Link>
        <MdFavoriteBorder className="text-2xl fill-pink-600" />
      </div>
    </>
  );
}

export default HomePage;
