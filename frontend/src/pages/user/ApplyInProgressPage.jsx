import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import UserGroupBar from "../../components/UserGroupBar";

function ApplyInProgressPage() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {

    //get user data from backend
    const fetchUser = async () => {
      
      try {
        console.log("userId: ", userId);
        const response = await fetch(`http://localhost:3000/api/user/appliedGroups/${userId}`);
        console.log(" response: ", response);
        console.log(" !response.ok: ", !response.ok);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
     
        const data = await response.json();
        console.log(" data", data);
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
