import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../store/AuthContext";
import SingleSearchedGroup from "../../components/SingleSearchedGroup";

function LikedGroupPage() {
  const { userId } = useParams();

  const { user, setUser, isLoading, setIsLoading, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && (!isLoggedIn || user._id !== userId)) {
      // if the user is not logged in, or logged in but not the user ID to be viewed
      navigate("/"); // redirect to the main page
    }
  }, []);
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
      <div className="text-3xl font-bold mb-8">Liked Groups</div>
      {/* Groups table */}
      <div className="">
        {isLoggedIn ? (
          likedGroups && likedGroups.length > 0 ? (
            likedGroups.map((group) => (
              // <UserGroupBar key={group._id} group={group} />
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
  );
}

export default LikedGroupPage;
