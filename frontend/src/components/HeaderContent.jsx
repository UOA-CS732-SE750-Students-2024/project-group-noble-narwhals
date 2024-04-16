import React from 'react';
import { Link } from 'react-router-dom';
import Button from './Button';

function HeaderContent({ details }) {
  return (
    <div className="max-w-main_content mx-auto mt-20 px-6 py-4">
      <div className="header-content flex justify-between items-start mb-4">
        <div className="header-title">
          <div className="text-4xl font-bold mb-2">Let us go fishing</div>
          <Link to="/activity" className="text-primary">Activity</Link>
          <div className="activity-detail py-6 mt-1">
            {details.map((detail, index) => (
              <p key={index} className="mb-2 flex items-center text-1xl">
                <detail.icon className="inline mr-2" style={{ fontSize: '24px' }} />
                <span>{detail.text}</span>

              </p>

            ))}
            <p className="mb-2 text-sm text-gray-500">Posted 1d ago</p>

          </div>
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
