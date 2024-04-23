import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import UserGroupBar from "../../components/UserGroupBar";

import { useUser } from '../../contexts/UserContext';

function LikedGroupPage() {
  console.log("enter likegrouppage: ");
  const { user, isLoggedIn, isLoading, error, fetchUserData } = useUser();
  console.log("user from likedgroup: ", user);
  if (error) {
    return <div>Error fetching data: {error.message}</div>;
  }
  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <img src="/image/Spinner.svg" alt="Loading..." />
      </div>
    );
  }else{
    console.log("user from likedgroup2: ", user);
  }

  // if user is not found (is null)
  if (!user) {
    return <div>User not found</div>;
  }

  const likedGroups = user.likedGroups;



  return (
    <div className="w-4/5 flex flex-col m-4 p-4">
      <div className="text-3xl mb-8">Liked Groups</div>
      {/* Groups table */}
      {likedGroups && likedGroups.length > 0 ? likedGroups.map((group) => (
        <UserGroupBar key={group._id} group={group} />
      )): (
        <p>No groups found.</p>
      )
      }
    </div>
  );
}

export default LikedGroupPage;
