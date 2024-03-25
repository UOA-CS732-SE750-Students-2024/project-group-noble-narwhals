import React from "react";
import { Link } from "react-router-dom";
import Button from "./Button";

function LogAndSign({ loginType, switchHandler }) {
    const type = loginType ? "Log in" : "Sign up";

  return (
    <div className="flex flex-col items-center justify-around p-11">
      <div className="flex flex-col items-center justify-around gap-8">
        <h1 className="text-5xl font-extrabold">Hey! Mate</h1>
        <img src="logo-no-bg.png" alt="logo" className="w-36 h-36" />
      </div>
      <form className="flex flex-col items-center">
        <input type="text" placeholder="Username" />
        <input type="password" placeholder="Password" />
        <Button>{type}</Button>
      </form>
      <div>
        OR
        <button>{type} with Google</button>
      </div>
      <div>
        First time with us? <div onClick={switchHandler}>Sign up</div> now
        <Link to={`${loginType ? "/Signup" : "/login"} "/login"`}>Login</Link>
      </div>
    </div>
  );
}

export default LogAndSign;
