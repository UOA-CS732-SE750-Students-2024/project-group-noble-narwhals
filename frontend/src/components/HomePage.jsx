import React from "react";
import { Link } from "react-router-dom";

function HomePage() {
  return (
    <>
      <div className="text-3xl">HomePage</div>
      <Link to="/login">Login</Link>
    </>
  );
}

export default HomePage;
