import React, { useState } from "react";
import LogAndSign from "../components/LogAndSign";
import { useNavigate } from "react-router-dom";

function LoginPage({ ifLogin = true }) {
  let navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(ifLogin);

  const switchLoginAndSign = () => {
    isLogin ? navigate("/signup") : navigate("/login");
    setIsLogin((preState) => !preState);
  };

  return (
    <div
      id="login_background"
      className="h-screen w-screen bg-gradient-to-b from-blue-400 to-emerald-300 flex flex-row justify-between relative"
    >
      <LogAndSign loginType={false} switchHandler={switchLoginAndSign} />
      <LogAndSign loginType={true} switchHandler={switchLoginAndSign} />
      <div
        id="login_cover"
        className={`absolute h-screen w-1/2 bg-primary flex flex-col justify-between p-9 transition-all duration-500 ${
          isLogin ? "left-0 rounded-r-2xl" : "left-1/2 rounded-l-2xl"
        }`}
      >
        <div className="font-bungee text-5xl text-white">
          Uplift your mind strengthen your circle
        </div>
        <img
          src={`${isLogin ? "/login_pic.png" : "/signup_pic.png"}`}
          alt="cover"
          className="w-5/6 mx-auto"
        />
      </div>
    </div>
  );
}

export default LoginPage;
