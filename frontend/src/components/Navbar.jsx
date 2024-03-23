import React from "react";
import { Link } from "react-router-dom";
import Button from "./Button";

function Navbar() {
  return (
    <nav>
      <div className="mx-auto max-w-main_content h-nav_height text-primary">
        <div
          id="nav_content"
          className="flex flex-row justify-between items-center h-full w-full px-4"
        >
          <Link to="/">left side </Link>
          <div className="flex flex-row gap-4">
            <Button>Login</Button>
            <Button style_type="fill">Sign up</Button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
