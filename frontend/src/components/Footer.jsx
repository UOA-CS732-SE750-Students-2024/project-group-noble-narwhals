import React from "react";
import Logo from "../assets/logo-no-bg.png";

function Footer() {
  return (
    <div className="bg-primary text-white p-4 rounded-b shadow flex items-start">
      <img src={Logo} alt="Logo" className="h-12 mr-3" />
      <div className="pt-1"> {/* Adjust padding-top as necessary to align the text with the top of the logo */}
        <p className="font-bold text-lg">Hey Mate</p>
        <p className="text-sm">Uplift your mind</p>
        <p className="text-sm">strengthen your circle</p>
      </div>
    </div>
  );
}
export default Footer;
