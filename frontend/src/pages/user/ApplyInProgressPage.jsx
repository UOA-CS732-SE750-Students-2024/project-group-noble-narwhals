import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import UserGroupBar from "../../components/UserGroupBar";

function ApplyInProgressPage() {
  const { userId } = useParams();
  
  const [isLoading, setIsLoading] = useState(true); // check if the page is loading

  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {

    setIsLoading(true); // set loading to true

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
        console.log(" data from applied group", data);
        setUser(data);
        setIsLoading(false); // set loading to false when data is fetched
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
      {appliedGroups.map((group) => (
        <UserGroupBar key={group._id} group={group} />
      ))}
    </div>
  );
}

export default ApplyInProgressPage;
