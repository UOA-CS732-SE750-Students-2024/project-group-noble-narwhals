import React, { useState, useEffect } from "react";
import Button from "../../components/Button";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { IoMdMale, IoMdFemale } from "react-icons/io";
import { useAuth } from "../../store/AuthContext";
import SingleSearchedGroup from "../../components/SingleSearchedGroup";

const PublicProfilePage = () => {
  const { isLoggedIn, user: loggedInUser, setIsLoggedIn } = useAuth();
  const { userId } = useParams();
  const [user, setUser] = useState(null); // add user state
  const [isLoading, setIsLoading] = useState(true);
  const [groups, setGroups] = useState([]);
  const [isShowTagPrompt, setIsShowTagPrompt] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchUserData = async () => {
      // Fetch user data from API, if the user is not logged in or viewing another user's profile
      try {
        let { data } = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/user/userData/${userId}`
        );
        setUser(data);

        if (
          data &&
          data.participatingGroups &&
          data.participatingGroups.length > 0
        ) {
          // sort the groups by groupStatus and createDate
          data.participatingGroups.sort((a, b) => {
            if (
              a.groupStatus === "available" &&
              b.groupStatus !== "available"
            ) {
              return -1;
            }
            if (
              b.groupStatus === "available" &&
              a.groupStatus !== "available"
            ) {
              return 1;
            }
            return new Date(b.createDate) - new Date(a.createDate);
          });
          setGroups(data.participatingGroups);
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
      setIsLoading(false);
    };

    if (isLoggedIn && userId === loggedInUser._id) {
      // Use logged in user data if viewing own profile

      setUser(loggedInUser);
      loggedInUser.participatingGroups.sort((a, b) => {
        if (a.groupStatus === "available" && b.groupStatus !== "available") {
          return -1;
        }
        if (b.groupStatus === "available" && a.groupStatus !== "available") {
          return 1;
        }

        return new Date(b.createDate) - new Date(a.createDate);
      });

      setGroups(loggedInUser.participatingGroups);
      setIsLoading(false);
    } else {
      fetchUserData();
    }
  }, [userId, isLoggedIn, loggedInUser]);

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <img src="/image/Spinner.svg" alt="Loading..." />
      </div>
    );
  }

  if (!user) {
    return <div>User not found.</div>;
  }

  return (
    <div className="flex overflow-y-auto items-center">
      <div className="m-4 p-4  bg-white flex flex-col flex-grow justify-center ">
        <div className="py-8">
          {/* Add new feature for tags reminder */}
          {isLoggedIn &&
            userId === loggedInUser._id &&
            (!user.profileTags || user.profileTags.length === 0) && (
              <div
                className={`fixed w-[280px] right-10 bottom-10 p-4 bg-blue-100 rounded-lg shadow-lg z-10 ${
                  isShowTagPrompt ? "" : "hidden"
                }`}
              >
                <span
                  className="absolute top-0 right-2 text-xl cursor-pointer block"
                  onClick={() => {
                    setIsShowTagPrompt(false);
                  }}
                >
                  ×
                </span>
                <p className="">
                  It seems you haven't added any tags in your profile! Tag
                  yourself can make people find you easily!
                </p>
                <Button
                  className="mt-2"
                  onClick={() => navigate(`/user/settings/${user._id}`)}
                >
                  Go to Settings
                </Button>
              </div>
            )}
          <div className="flex items-center mb-2">
            <img
              className="w-24 h-24 md:w-40 md:h-40 rounded-full mr-4"
              src={user.avatar}
              alt="User Avatar"
            />
            <div className="flex flex-col justify-around gap-6">
              <div className="flex flex-row items-center  gap-2">
                <p className="text-3xl font-bold mx-5">{user.name}</p>
                {user.gender === "Male" && (
                  <IoMdMale className="fill-sky-500 text-2xl" />
                )}
                {user.gender === "Female" && (
                  <IoMdFemale className="fill-pink-500 text-2xl" />
                )}
                {user.isVerification ? (
                  <div className="p-1 px-2 rounded-full text-center bg-primary text-white text-xs">
                    Verified
                  </div>
                ) : (
                  <div className="p-1 px-2  rounded-full text-center bg-gray-400 text-white text-xs">
                    Unverified
                  </div>
                )}
              </div>

              <div className="ml-5 flex items-center ">Email: {user.email}</div>
              <div className="flex ml-5 mb-5 flex-wrap">
                {user.profileTags &&
                  user.profileTags.map((tag) => (
                    <ProfileTags key={tag._id} tagName={tag.name} />
                  ))}
              </div>
              {isLoggedIn &&
                userId === loggedInUser._id &&
                !user.isVerification && (
                  <div className="ml-3 border-2 rounded-full py-1 bg-amber-200 text-xs px-3 text-gray-600">
                    Your account is not verified. Unverified accounts may not
                    create a group in HeyMate. Please go to Settings.
                  </div>
                )}
            </div>
          </div>
        </div>
        {/* Groups section */}
        <div className="text-3xl mb-8">Groups</div>
        <div className="">
          {isLoggedIn ? (
            groups && groups.length > 0 ? (
              groups.map((group) => (
                //<UserGroupBar key={group._id} group={group} /> */}
                <SingleSearchedGroup key={group._id} group={group} />
              ))
            ) : (
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
