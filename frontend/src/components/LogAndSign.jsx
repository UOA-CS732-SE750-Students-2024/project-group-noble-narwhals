import React, { useState } from "react";
import Button from "./Button";
import { FcGoogle } from "react-icons/fc";
import { IoIosEye } from "react-icons/io";
import { IoIosEyeOff } from "react-icons/io";

function LogAndSign({ loginType, switchHandler }) {
  const [showPassword, setShowPassword] = useState(false);

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

  return (
    <div className="flex flex-col items-center justify-around p-11 w-full">
      <div className="flex flex-col items-center justify-around gap-6">
        <h1 className="text-5xl font-extrabold">
          {loginType ? "Hey!" : "Welcome!"} Mate
        </h1>
        <img src="logo-no-bg.png" alt="logo" className="w-36 h-36" />
        <form
          onSubmit={submitHandler}
          className="flex flex-col items-center gap-9"
        >
          <div className="w-full flex flex-row items-center h-10 p-1 pl-4 rounded-full bg-white focus-within:outline outline-2 outline-primary">
            <input
              type="text"
              placeholder="Username"
              className="outline-none"
            />
          </div>
          <div className="w-full flex flex-row items-center h-10 p-1 pl-4 rounded-full bg-white focus-within:outline outline-2 outline-primary">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="outline-none"
            />
            <div
              onClick={showPasswordHandler}
              className="flex flex-row items-center justify-center w-8 h-8 hover:bg-gray-200 rounded-full"
            >
              {showPassword ? <IoIosEye /> : <IoIosEyeOff />}
            </div>
          </div>
          <Button style_type="fill">{type}</Button>
        </form>
      </div>
      <div className="flex flex-col items-center gap-5">
        <div className="font-bungee text-xl ">OR</div>
        <Button className="flex flex-row bg-white items-center gap-4 p-4 h-10 mb-9">
          <FcGoogle className="w-8 h-8" /> {type} with Google
        </Button>
      </div>
      <div className="flex flex-col items-center">
        {contentBlow}
        <div>
          <span
            className="text-secondary cursor-pointer"
            onClick={switchHandler}
          >
            {loginType ? "Sign up" : "Log in"}
          </span>{" "}
          here
        </div>
      </div>
    </div>
  );
}

export default LogAndSign;
