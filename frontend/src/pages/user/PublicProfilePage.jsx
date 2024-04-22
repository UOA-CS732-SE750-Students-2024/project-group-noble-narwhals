import React, { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { GroupTableRow } from "../../components/GroupTableRow";
import { IoMdMale } from "react-icons/io";
import { IoMdFemale } from "react-icons/io";

import UserGroupBar from "../../components/UserGroupBar";

const PublicProfilePage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(true); // suppose the user is logged in 
  const { userId } = useParams();

  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {


    //get user data from backend
    const fetchUser = async () => {
      
      try {
        console.log("userId: ", userId);
        const response = await fetch(`http://localhost:3000/api/user/participatingGroups/${userId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
     
        const data = await response.json();
        console.log("data from public profile", data);
        setUser(data);
      } catch (e) {
        setError(e);
      }
    };
    if (userId) {
      fetchUser();
    }

  }, [userId]);

  if (error) {
    return <div>Error fetching data: {error.message}</div>;
  }

  // if user is not found (is null)
  if (!user) {
    return <div>User not found</div>;
  }

  const userName = `${user.name}`; 
  const email = `${user.email}`; 
  const avatar = `${user.avatar}`;
  const gender = `${user.gender}`;
  const tags = user.profileTags; 
  const participatingGroups = user.participatingGroups;
  console.log("tags:", tags);
  console.log("participatingGroups:", participatingGroups);
  




  return (
    <div className="flex min-w-fit overflow-y-auto">
      <div className="pl-10 pr-10 bg-white flex flex-col flex-grow">
        <div className="py-8">
          <div className="flex items-center mb-2">
            <img
              className="w-40 h-40 rounded-full mr-4"
              src={avatar}
              alt="User Avatar"
            />
            <div>
              <div className="flex flex-row">
                <p className="text-xl font-bold m-5">{userName}</p>
                {gender === "male" && (
                  <IoMdMale className="fill-sky-500 text-2xl mt-5" />
                )}
                {gender === "female" && (
                  <IoMdFemale className="fill-pink-500 text-2xl mt-5" />
                )}
              </div>
              <div className="ml-5 mr-5 mb-5 ">Email: {email}</div>
              <div className="flex ml-5 mr-5 mb-5">
                {tags && tags.map((tag) => (
                  <ProfileTags key={tag._id} tagName={tag.name} />
                ))}

              </div>
            </div>
          </div>
        </div>
        {/* Groups section */}
        <div className="text-3xl mb-8">Groups</div>
        {isLoggedIn ? (
          participatingGroups && participatingGroups.map((group) => (
            <UserGroupBar key={group._id} group={group} />
          ))
        ) : (
          <div className="text-lg text-gray-400 ">Please log in first.</div>
        )}
      </div>
    </div>
  );
};

function ProfileTags({ tagName }) {
  return (
    <div className="rounded-2xl border-primary border pl-2 pr-2 mr-2">
      {tagName}
    </div>
  );
}

export default PublicProfilePage;
export { ProfileTags };
