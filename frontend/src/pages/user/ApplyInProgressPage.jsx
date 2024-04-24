import React from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../store/AuthContext";
import { useNavigate  } from "react-router-dom";
import UserGroupBar from "../../components/UserGroupBar";

function ApplyInProgressPage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user, setUser, isLoading, setIsLoading, isLoggedIn} = useAuth();

  useEffect(() => {
    if (!isLoading && (!isLoggedIn || user._id !== userId)) {
      // if the user is not logged in, or logged in but not the user ID to be viewed
      // redirect to the main page
      navigate('/'); 
    }
  },[]);

  
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
      {appliedGroups && appliedGroups.length > 0 ? appliedGroups.map((group) => (
        <UserGroupBar key={group._id} group={group} />
      )): (
        <p>No groups found.</p>
      )
      }
    </div>
  );
}

export default ApplyInProgressPage;
