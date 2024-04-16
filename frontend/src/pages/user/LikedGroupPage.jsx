import React from "react";

import dummyGroups from "../../components/dummyGroups";
import UserGroupBar from "../../components/UserGroupBar";
function LikedGroupPage() {
  return (
    <div className="w-4/5 flex flex-col mx-auto p-4">
      <div className="text-3xl mb-8">Liked Groups</div>
      {/* Groups table */}
      {dummyGroups.map((group, index) => (
        <UserGroupBar key={index} group={group} />
      ))}
    </div>
  );
}

export default LikedGroupPage;
