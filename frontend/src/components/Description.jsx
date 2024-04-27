import React from "react";

function Description({ description }) {  
    return (
      <>
        <div className="description p-6 -mt-8">
          <h3 className="font-semibold mb-4 text-2xl">Description</h3>
          <p>{description}</p>  
        </div>
      </>
    );
}

export default Description;
