import React from "react";
import { Link } from "react-router-dom";
import { MdFavoriteBorder } from "react-icons/md";


function HomePage() {
  return (
    <>
      <div id="main_content">
        <div className="text-3xl">HomePage</div>
        <Link to="/login">Login</Link>
        <Link to="/group/2">Group Info</Link>

        <MdFavoriteBorder className="text-2xl fill-pink-600" />
      </div>
    </>
  );
}

export default HomePage;
