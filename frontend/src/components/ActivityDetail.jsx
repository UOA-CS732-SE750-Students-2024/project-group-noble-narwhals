import React from 'react';

function ActivityDetail({ details }) {
    return (
      <div className="activity-detail p-6 mt-6">
        {details.map((detail, index) => (
          <p key={index} className="mb-2 flex items-center text-1xl">
            <detail.icon className="inline mr-2" style={{ fontSize: '24px' }} />
            <span>{detail.text}</span>
            
          </p>
          
        ))}
                  <p className="mb-2 text-sm text-gray-500">Posted 1d ago</p>

      </div>
    );
  }
  
  export default ActivityDetail;