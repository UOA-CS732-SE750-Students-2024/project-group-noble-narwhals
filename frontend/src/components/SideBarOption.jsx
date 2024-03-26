import React from 'react';
import { Link } from 'react-router-dom';

export default function SidebarOption({ icon, label, to, handleClick }) {
  return (
    <div
      className="p-3 flex items-center justify-center hover:bg-secondary text-white cursor-pointer transition-colors duration-100"
      onClick={() => handleClick(label)}
    >
      <Link to={to} className="flex items-center w-full justify-start pl-4">
        {icon}
        {label}
      </Link>
    </div>
  );
}
