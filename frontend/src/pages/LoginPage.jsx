import React from "react";
import LogAndSign from "../components/LogAndSign";

function LoginPage({ isLogin = false }) {
  return (
    <div
      id="background"
      className="h-screen w-screen bg-gradient-to-b from-blue-400 to-emerald-300 flex flex-row justify-around relative"
    >
      <LogAndSign type="Sign up" />
      <LogAndSign type="Log in" />
      <div
        id="cover"
        className={`absolute h-screen w-1/2 bg-primary flex flex-col justify-between p-5 ${
          isLogin ? "left-0 rounded-r-2xl" : "left-1/2 rounded-l-2xl"
        }`}
      >
        <div className="font-bungee text-7xl text-white">
          Uplift your mind strengthen your circle
        </div>
        {isLogin && <img src="login_pic.png" alt="cover" className="w-full" />}
        {!isLogin && (
          <div className="flex flex-row gap-7 items-end ">
            <img src="signup_pic.png" alt="cover" className="w-full " />
          </div>
        )}
      </div>
    </div>
  );
}

export default LoginPage;
