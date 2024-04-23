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
      // 如果用户未登录，或者登录了但不是要查看的用户ID
      navigate('/'); // 重定向到主页
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
