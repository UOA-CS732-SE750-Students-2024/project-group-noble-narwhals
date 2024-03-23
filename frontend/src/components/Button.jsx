import React from "react";

const Button = ({ onClick, className, children, style_type }) => {
  let style = "border-2 border-primary text-primary hover:bg-primary hover:text-white ";
  if (style_type === "fill") {
    style = "bg-primary text-white hover:bg-pink-600";
  }

  return (
    <button onClick={onClick} className={`${style} ${className}`}>
      {children}
    </button>
  );
};

export default Button;
