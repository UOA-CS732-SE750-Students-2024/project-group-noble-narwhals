import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

import { useUser } from "../../contexts/UserContext"

import UserGroupBar from "../../components/UserGroupBar";

function ApplyInProgressPage() {
  const { user, isLoggedIn, isLoading, error, fetchUserData } = useUser();

  if (error) {
    return <div>Error fetching data: {error.message}</div>;
  }
  
  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <img src="/image/Spinner.svg" alt="Loading..." />
      </div>
    );
  }
  // if user is not found (is null)
  if (!user) {
    return <div>User not found</div>;
  }


  const appliedGroups = user.appliedGroups;
  console.log("appliedGroups: ", appliedGroups);
  return (
    <div className="w-4/5 flex flex-col m-4 p-4">
      <div className="text-3xl mb-8">Apply in Progress</div>
      {/* Groups table */}
      {appliedGroups.map((group) => (
        <UserGroupBar key={group._id} group={group} />
      ))}
    </div>
  );
}

export default ApplyInProgressPage;
