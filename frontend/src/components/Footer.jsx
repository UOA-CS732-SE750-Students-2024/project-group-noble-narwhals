import React from "react";
import Logo from "../assets/logo-no-bg.png";

function Footer() {
    return (
      <div className="bg-primary text-white p-4 rounded-b shadow flex">
        <div className="flex items-center">
          <img src={Logo} alt="Logo" className="h-12 mr-3" />
          <div>
            <p className="font-bold text-lg">Hey Mate</p>
            <p className="text-sm">Uplift your mind</p>
            <p className="text-sm">strengthen your circle</p>
          </div>
        </div>
      </div>
    );
  }
export default Footer;