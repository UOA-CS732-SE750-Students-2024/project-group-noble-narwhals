import React from "react";
import { Link } from "react-router-dom";

function HomePage() {
  return (
    <>
      <div className="text-3xl">HomePage</div>
      <Link to="/login">Login</Link>
      <Link to="/group/1">GroupInfo</Link>
    </>
  );
}

export default HomePage;
