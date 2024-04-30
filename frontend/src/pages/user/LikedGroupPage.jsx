import React from "react";
import UserGroupBar from "../../components/UserGroupBar";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../store/AuthContext";
// import { useUser } from '../../contexts/UserContext';

function LikedGroupPage() {
  const { userId } = useParams();
  console.log("enter likegrouppage: ");
  const { user, setUser, isLoading, setIsLoading, isLoggedIn} = useAuth();
  const navigate = useNavigate();
  console.log("user from likedgroup: ", user);

  useEffect(() => {
    if (!isLoading && (!isLoggedIn || user._id !== userId)) {
      // if the user is not logged in, or logged in but not the user ID to be viewed
      navigate('/'); // redirect to the main page
    }
  },[]);
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

  let likedGroups = user.likedGroups;
  // sort the groups by time
  if (likedGroups && likedGroups.length > 0) {
    likedGroups.sort((a, b) => {
      return new Date(b.createDate) - new Date(a.createDate);
    });
  }



  return (
    <div className="flex flex-col m-4 p-4">
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
