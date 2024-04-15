import React, { useState, useRef } from "react";
import Button from "./Button";

import { FcGoogle } from "react-icons/fc";
import { IoIosEye } from "react-icons/io";
import { IoIosEyeOff } from "react-icons/io";

function LogAndSign({ loginType, switchHandler }) {
  const [showPassword, setShowPassword] = useState(false);
  const usenameRef = useRef();
  const passwordRef = useRef();

  const showPasswordHandler = () => {
    setShowPassword((preState) => !preState);
  };

  const type = loginType ? "Log in" : "Sign up";
  const contentBlow = loginType
    ? "First time with us?"
    : "Already have an account?";

  const submitHandler = (e) => {
    e.preventDefault();

    // need to be implemented
  };

  const googleAuth = (e) => {
    e.preventDefault;
    window.open(
      `${import.meta.env.VITE_API_BASE_URL}/auth/google/callback`,
      "_self"
    );
  };

  return (
    <div
      id="login_content"
      className="flex flex-col items-center justify-center w-full"
    >
      <div className="flex flex-col items-center justify-around pb-11 w-full gap-8 ">
        <div className="flex flex-col items-center justify-around gap-2">
          <h1 className="text-4xl font-extrabold text-primary">
            {loginType ? "Hey!" : "Welcome!"} Mate
          </h1>
          <img src="/image/logo-no-bg.png" alt="logo" className="w-28 h-28" />
          <form
            onSubmit={submitHandler}
            className="flex flex-col items-center gap-4 w-64 mt-5"
          >
            <div className="w-64 flex flex-row items-center justify-between h-10 p-1 pl-4 rounded-full bg-white hover:outline focus-within:outline outline-2 outline-primary">
              <input
                type="text"
                placeholder="Username"
                className="outline-none w-full"
                ref={usenameRef}
              />
            </div>
            <div className="w-64 flex flex-row items-center justify-between h-10 p-1 pl-4 rounded-full bg-white hover:outline focus-within:outline outline-2 outline-primary">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="outline-none"
                ref={passwordRef}
              />
              <div
                onClick={showPasswordHandler}
                className="flex flex-row items-center justify-center w-8 h-8 hover:bg-gray-200 rounded-full"
              >
                {showPassword ? <IoIosEye /> : <IoIosEyeOff />}
              </div>
            </div>
            <Button style_type="fill" className="w-64">
              {type}
            </Button>
          </form>
        </div>
        <div className="flex flex-col items-center gap-3">
          <div className="font-bungee text-xl ">OR</div>
          <Button className="flex flex-row bg-white items-center gap-4 p-4 h-11 mb-10 rounded-full w-64">
            <FcGoogle className="w-8 h-8" /> {type} with Google
          </Button>
        </div>
        <div className="flex flex-col items-center">
          {contentBlow}
          <div>
            <span
              className="text-secondary cursor-pointer hover:underline"
              onClick={switchHandler}
            >
              {loginType ? "Sign up" : "Log in"}
            </span>{" "}
            here
          </div>
        </div>
      </div>
    </div>
  );
}

export default LogAndSign;
