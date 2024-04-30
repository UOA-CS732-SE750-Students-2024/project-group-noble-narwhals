import React from "react";

function Footer() {
  const footerImagePath = "/footerImage.png";

  return (
    <div className="bg-primary text-white h-64 ">
      <div className="w-4/5 sm:w-10/12 max-w-mainContent mx-auto">
        <img src={footerImagePath} alt="Footer" className="h-40 " />
      </div>
    </div>
  );
}

export default Footer;
