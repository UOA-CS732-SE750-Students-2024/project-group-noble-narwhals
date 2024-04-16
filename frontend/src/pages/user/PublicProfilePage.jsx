// This page is for the public profile page of a user, showing basic user information and their groups 
// where they are currently participating
import React from 'react';
import { useState } from 'react';
import { GroupTableRow } from '../../components/GroupTableRow';
import { IoMdMale } from "react-icons/io";
import { IoMdFemale } from "react-icons/io";

import dummyGroups from '../../components/dummyGroups';
import UserGroupBar from '../../components/UserGroupBar';

const PublicProfilePage = () => {
    const [gender, setGender] = useState("male");

    const userName = "Rainman96"; // dummy data for user name
    const email = "tpan501@aucklanduni.ac.nz" // dummy data for email

    const tags = [
        { tagId: 1, tagName: "tag1" },
        { tagId: 2, tagName: "tag2" }
    ]; // dummy data for tags

    return (
        // ======================profile information div starts from here======================
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
                {/* ==================Groups div starts from here===================== */}
                <div className="text-3xl mb-8">Groups</div>
                {dummyGroups.map((group,index) => (
                    <UserGroupBar key={index} group={group} />
                ))}
            </div>
        </div>

    );
};

function ProfileTags({ tagName }) {
    return (
        <div className="rounded-2xl border-primary border pl-2 pr-2 mr-2">{tagName}</div>
    )
}

export default PublicProfilePage;
export { ProfileTags };