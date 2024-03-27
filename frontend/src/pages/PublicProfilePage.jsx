// This page is for the public profile page of a user, showing basic user information and their groups 
// where they are currently participating
import React from 'react';
import { useState } from 'react';
import { GroupTableRow } from '../components/GroupTableRow';
import { IoMdMale } from "react-icons/io";
import { IoMdFemale } from "react-icons/io";


const PublicProfilePage = () => {
    const [gender, setGender] = useState("male");

    const userName = "Rainman96"; // dummy data for user name
    const email = "tpan501@aucklanduni.ac.nz" // dummy data for email

    const tags = [
        { tagId: 1, tagName: "tag1" },
        { tagId: 2, tagName: "tag2" }
    ]; // dummy data for tags

    const groups = [ // dummy data for groups
        { id: 1, groupName: "Group 1", category: "Project", due: "1 day left", groupOwner: "Owner 1", members: "2/4", status: "Open" },
        { id: 2, groupName: "Group 2", category: "Activity", due: "1 day left", groupOwner: "Owner 2", members: "5/5", status: "Close" },
        { id: 3, groupName: "Group 3", category: "Study", due: "1 day left", groupOwner: "Rainman96", members: "3/3", status: "Open" },
    ];

    return (
        <div className="flex min-w-fit overflow-y-auto"  >

            <div className="pl-10 pr-10 bg-white flex flex-col flex-grow">
                <div className="py-8">

                    <div className="flex items-center mb-2">
                        <img
                            className="w-40 h-40 rounded-full mr-4"
                            src="https://www.animesenpai.net/wp-content/uploads/2022/12/Bocchi-The-Rock-21-1024x576.webp"
                            alt="User Avatar"
                        />
                        <div>
                            <div className='flex flex-row'>
                                <p className="text-xl font-bold m-5">{userName}</p>
                                {gender === 'male' && <IoMdMale className='fill-sky-500 text-2xl mt-5' />}
                                {gender === 'female' && <IoMdFemale className='fill-pink-500 text-2xl mt-5' />}
                            </div>
                            <div className="ml-5 mr-5 mb-5 ">Email: {email}</div>
                            <div className="flex ml-5 mr-5 mb-5">
                                {tags.map((tag) => (
                                    <ProfileTags key={tag.tagId} tagName={tag.tagName} />
                                ))
                                }
                            </div>
                        </div>

                    </div>


                </div>
        
                <div className="flex flex-col">
                    <div className="text-3xl mb-8">Groups</div>
                    {/* Groups table */}
                    <table className="w-full border-collapse border-spacing-7 ">
                        <thead className=" ">
                            <tr>
                                <th className="border-b border-gray-700 text-left py-2 px-3 ">Group Name</th>
                                <th className="border-b border-gray-700 text-left py-2  px-3">Category</th>
                                <th className="border-b border-gray-700 text-left py-2  px-3">Due</th>
                                <th className="border-b border-gray-700 text-left py-2  px-3">Group Owner</th>
                                <th className="border-b border-gray-700 text-left py-2  px-3">Member</th>
                                <th className="border-b border-gray-700 text-left py-2 px-3 ">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {groups.map((group) => (
                                <GroupTableRow
                                    key={group.id}
                                    groupName={group.groupName}
                                    category={group.category}
                                    due={group.due}
                                    groupOwner={group.groupOwner == userName ? "You" : group.groupOwner}
                                    members={group.members}
                                    status={group.status}
                                />
                            ))
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

    );
};

function ProfileTags({tagName}){
    return(
        <div className="rounded-2xl border-primary border pl-2 pr-2 mr-2">{tagName}</div>
    )
}

export default PublicProfilePage;
export { ProfileTags };