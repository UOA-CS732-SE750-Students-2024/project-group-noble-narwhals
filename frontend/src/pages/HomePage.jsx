import React from "react";
import { Link } from "react-router-dom";
import { MdFavoriteBorder } from "react-icons/md";


function HomePage() {
  return (
    <>
      <div id="main_content" className="mx-auto w-4/5 max-w-main_content mt-nav_height">
        <div className="text-3xl">HomePage</div>
        <Link to="/login">Login</Link>
        <MdFavoriteBorder className="text-2xl fill-pink-600" />
      </div>
    </>
  );
}

export default HomePage;
