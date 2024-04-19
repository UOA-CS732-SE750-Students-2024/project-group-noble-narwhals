import React, { useState, useRef } from "react";
import Button from "./Button";
import axios from "axios";
axios.defaults.withCredentials = true;

import { FcGoogle } from "react-icons/fc";
import { IoIosEye } from "react-icons/io";
import { IoIosEyeOff } from "react-icons/io";

function LogAndSign({ loginType, switchHandler }) {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(" ");
  const emailRef = useRef();
  const passwordRef = useRef();

  const showPasswordHandler = () => {
    setShowPassword((preState) => !preState);
  };

  const type = loginType ? "Log in" : "Sign up";
  const contentBlow = loginType
    ? "First time with us?"
    : "Already have an account?";

  //login or Signup handler
  const submitHandler = (e) => {
    e.preventDefault();
    setError(" ");

    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const url = loginType ? `${apiUrl}/auth/login` : `${apiUrl}/auth/signup`;
    const payload = {
      email: emailRef.current.value,
      password: passwordRef.current.value,
    };

    axios
      .post(url, payload)
      .then((response) => {
        if (loginType && response.status === 200) {
          window.location.href = "/";
        } else {
          switchHandler();
          emailRef.current.value = "";
          passwordRef.current.value = "";
        }
      })
      .catch((error) => {
        if (error.response) {
          setError(error.response.data.message || "An error occurred");
        } else {
          setError("An error occurred");
        }
      });
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
                type="email"
                placeholder="E-mail"
                className="outline-none w-full"
                ref={emailRef}
              />
            </div>
            <div className="w-64 flex flex-row items-center justify-between h-10 p-1 pl-4 rounded-full bg-white hover:outline focus-within:outline outline-2 outline-primary">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="outline-none"
                ref={passwordRef}
                minLength="8"
              />
              <div
                onClick={showPasswordHandler}
                className="flex flex-row items-center justify-center w-8 h-8 hover:bg-gray-200 rounded-full"
              >
                {showPassword ? <IoIosEye /> : <IoIosEyeOff />}
              </div>
            </div>
            {error && <div className="text-red-500 h-2 text-sm">{error}</div>}
            <Button style_type="fill" className="w-64">
              {type}
            </Button>
          </form>
        </div>
        <div className="flex flex-col items-center gap-3">
          <div className="font-bungee text-xl ">OR</div>
          <Button
            className="flex flex-row bg-white items-center gap-4 p-4 h-11 mb-10 rounded-full w-64 "
            onClick={googleAuth}
          >
            <FcGoogle className="w-8 h-8 " /> {type} with Google
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
