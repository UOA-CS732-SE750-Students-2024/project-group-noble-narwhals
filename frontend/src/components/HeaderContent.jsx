import React from 'react';
import { Link } from 'react-router-dom';
import Button from './Button';

function HeaderContent() {
  return (
    <div className="max-w-main_content mx-auto mt-10">
      <div className="header-content flex justify-between items-start mb-4">
        <div className="header-title">
          <div className="text-4xl font-bold mb-2">Let us go fishing</div>
          <Link to="/activity" className="text-primary">Activity</Link>
        </div>
        <div className="actions flex flex-col space-y-2">
          <Button className="py-3 px-16" style_type="fill">Join</Button>
          <Button className="py-3 px-16" style_type="border">Edit</Button>
        </div>
      </div>
    </div>
  );
}

export default HeaderContent;
