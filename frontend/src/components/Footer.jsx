import React from "react";

function Footer() {
  const footerImagePath = "/footerImage.png";

  return (
    <div className="bg-primary text-white p-4 rounded-b shadow flex items-start h-80">
      <div className="w-4/5 max-w-main_content mx-auto">
        <img src={footerImagePath} alt="Footer" className="h-40 " />
      </div>
    </div>
  );
}

export default Footer;
