import React from "react";
import { useEffect } from "react";
import { useAuth } from "../../store/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import SingleSearchedGroup from "../../components/SingleSearchedGroup";

function ApplyInProgressPage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user, setUser, isLoading, setIsLoading, isLoggedIn } = useAuth();

  useEffect(() => {
    if (!isLoading && (!isLoggedIn || user._id !== userId)) {
      // if the user is not logged in, or logged in but not the user ID to be viewed
      // redirect to the main page
      navigate("/");
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

  let appliedGroups = user.appliedGroups;
  // sort the groups by time
  if (appliedGroups && appliedGroups.length > 0) {
    // appliedGroups.sort((a, b) => {
    //   return new Date(b.createDate) - new Date(a.createDate);
    // });
    user.appliedGroups.sort((a, b) => {
      if (a.groupStatus === "available" && b.groupStatus !== "available") {
        return -1;
      }
      if (b.groupStatus === "available" && a.groupStatus !== "available") {
        return 1;
      }

      return new Date(b.createDate) - new Date(a.createDate);
    });

  }

  return (
    <div className="flex flex-col m-4 p-4">
      <div className="text-3xl font-bold mb-8">Apply in Progress</div>
      {/* Groups table */}
      <div className="">
        {isLoggedIn ? (
          appliedGroups && appliedGroups.length > 0 ? (
            appliedGroups.map((group) => (
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

export default ApplyInProgressPage;
