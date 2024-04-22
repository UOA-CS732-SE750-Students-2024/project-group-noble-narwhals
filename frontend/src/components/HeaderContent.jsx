import React from 'react';
import { Link } from 'react-router-dom';
import Button from './Button';

function HeaderContent({ groupName, groupTags, postedDate, activityDetails,isHost  }) {
  return (
    <div className="max-w-main_content mx-auto mt-20 px-6 py-4">
      <div className="header-content flex justify-between items-start mb-4">
        <div className="header-title">
          <div className="text-4xl font-bold mb-2">{groupName}</div>
          <Link to="/" className="text-primary">Activity</Link>
          <div className="activity-detail py-6 mt-1">
            <p className="mb-2 flex items-center text-1xl">{groupTags}</p>
            <p className="mb-2 -mt-6 text-sm text-gray-500">Posted {postedDate}</p>
          </div>
          <div className="-mt-6">
            {activityDetails.map((detail, index) => (
              <div key={index} className="flex items-center mb-2">
                {detail.icon}
                <span className="ml-2">{detail.text}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="actions flex flex-col space-y-2">
        {isHost ? (
            <Button className="py-3 px-16" style_type="border">Edit</Button>
          ) : (
            <Button className="py-3 px-16" style_type="fill">Join</Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default HeaderContent;
