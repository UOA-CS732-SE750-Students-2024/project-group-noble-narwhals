import React from 'react';

import dummyGroups from '../../components/dummyGroups';
import UserGroupBar from '../../components/UserGroupBar';
function LikedGroupPage() {

    return (
        <div className="flex flex-col m-4 p-4">
            <div className="text-3xl mb-8">Liked Groups</div>
            {/* Groups table */}
            {dummyGroups.map((group,index) => (
                <UserGroupBar key={index} group={group} />
            ))}
        </div>
    )
}

export default LikedGroupPage;