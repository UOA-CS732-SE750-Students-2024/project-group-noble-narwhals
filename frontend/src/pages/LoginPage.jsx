import React, { useState } from "react";
import LogAndSign from "../components/LogAndSign";

function LoginPage({ ifLogin = true }) {
  const [isLogin, setIsLogin] = useState(ifLogin);

  const switchLoginAndSign = () => {
    setIsLogin((preState) => !preState);
  };

  return (
    <div
      id="background"
      className="h-screen w-screen bg-gradient-to-b from-blue-400 to-emerald-300 flex flex-row justify-around relative"
    >
      <LogAndSign loginType={false} switchHandler={switchLoginAndSign} />
      <LogAndSign loginType={true} switchHandler={switchLoginAndSign} />
      <div
        id="cover"
        className={`absolute h-screen w-1/2 bg-primary flex flex-col justify-between p-5 transition-all duration-500 ${
          isLogin ? "left-0 rounded-r-2xl" : "left-1/2 rounded-l-2xl"
        }`}
      >
        <div className="font-bungee text-7xl text-white">
          Uplift your mind strengthen your circle
        </div>
        <img
          src={`${isLogin ? "login_pic.png" : "signup_pic.png"}`}
          alt="cover"
          className="w-full"
        />
      </div>
    </div>
  );
}

export default LoginPage;
