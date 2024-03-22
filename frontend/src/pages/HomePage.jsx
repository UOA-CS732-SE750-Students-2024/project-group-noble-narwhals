import React from "react";
import { Link } from "react-router-dom";

function HomePage() {
  return (
    <>
      <div className="text-3xl">HomePage</div>
      <h1 className="text-3xl font-bold underline text-sky-500">HomePage</h1>
      <Link to="/login">Login</Link>
      <Link to="/group/1">GroupInfo</Link>
    </>
  );
}

export default HomePage;
