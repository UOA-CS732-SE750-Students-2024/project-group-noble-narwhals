import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { IoMdMale, IoMdFemale } from "react-icons/io";
import { useAuth } from "../../store/AuthContext";
import UserGroupBar from "../../components/UserGroupBar";

const PublicProfilePage = () => {
  const { isLoggedIn, user: loggedInUser, setIsLoggedIn } = useAuth();
  const { userId } = useParams();
  const [user, setUser] = useState(null); // 更改此处的 setUser 不冲突了
  const [isLoading, setIsLoading] = useState(true);
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      // Fetch user data from API, if the user is not logged in or viewing another user's profile
      try {
        console.log("userId: ", userId)
        const { data } = await axios.get(`http://localhost:3000/api/user/userData/${userId}`);
        setUser(data);
        console.log("data from user route: ", data);
        if (data && data.participatingGroups && data.participatingGroups.length > 0) {
          setGroups(data.participatingGroups); 
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
      setIsLoading(false);
    };

    if (isLoggedIn && userId === loggedInUser._id) {
      // Use logged in user data if viewing own profile
      console.log("isLoggedIn? ", isLoggedIn);
      console.log("isLoggedIn is true? ", userId === loggedInUser._id);
      setUser(loggedInUser);
      setGroups(loggedInUser.participatingGroups); 
      setIsLoading(false);
    } else {
      console.log("isLoggedIn is false ");
      fetchUserData();
    }
  }, [userId, isLoggedIn, loggedInUser]);

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <img src="/image/Spinner.svg" alt="Loading..." />
      </div>
    );
  }

  if (!user) {
    return <div>User not found.</div>;
  }

  return (
    <div className="flex min-w-fit overflow-y-auto">
      <div className="m-4 p-4  bg-white flex flex-col flex-grow">
        <div className="py-8">
          <div className="flex items-center mb-2">
            <img
              className="w-40 h-40 rounded-full mr-4"
              src={user.avatar}
              alt="User Avatar"
            />
            <div>
              <div className="flex flex-row">
                <p className="text-xl font-bold m-5">{user.name}</p>
                {user.gender === "Male" && (
                  <IoMdMale className="fill-sky-500 text-2xl mt-5" />
                )}
                {user.gender === "Female" && (
                  <IoMdFemale className="fill-pink-500 text-2xl mt-5" />
                )}
              </div>
              <div className="ml-5 mr-5 mb-5 ">Email: {user.email}</div>
              <div className="flex ml-5 mr-5 mb-5">
                {user.profileTags && user.profileTags.map((tag) => (
                  <ProfileTags key={tag._id} tagName={tag.name} />
                ))}
              </div>
            </div>
          </div>
        </div>
        {/* Groups section */}
        <div className="text-3xl mb-8">Groups</div>
        <div className="">
          {isLoggedIn ? (
            groups && groups.length > 0 ? groups.map((group) => (
              <UserGroupBar key={group._id} group={group} />
            )) : (
              <p>No groups found.</p>
            )

          ) : (
            <div className="text-lg text-gray-400 ">Please log in first.</div>
          )}
        </div>
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
