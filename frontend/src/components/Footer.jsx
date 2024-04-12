import React from "react";

function Footer() {
  const footerImagePath = "/footerImage.png"; 

  return (
    <div className="bg-primary text-white p-4 rounded-b shadow flex items-start">
      <img src={footerImagePath} alt="Footer" className="h-auto w-60" />
    </div>
  );
}

export default Footer;
