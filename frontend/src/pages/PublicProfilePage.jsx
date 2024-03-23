// This page is for the public profile page of a user, showing basic user information and their groups 
// where they are currently participating
import React from 'react';
import { useState } from 'react';
import { IoMdMale } from "react-icons/io";
import { IoMdFemale } from "react-icons/io";
import '../index.css';

const PublicProfilePage = () => {
    const [gender, setGender] = useState("male"); 
    
    return (
        <div className="flex">

            <div className="pl-10 bg-white flex flex-col flex-grow">
                <div className="py-8">
                
                    <div className="flex items-center mb-2">
                        <img
                            className="w-40 h-40 rounded-full mr-4"
                            src="https://www.animesenpai.net/wp-content/uploads/2022/12/Bocchi-The-Rock-21-1024x576.webp"
                            alt="User Avatar"
                        />
                        <div>
                            <div className='flex flex-row'>
                                <p className="text-xl font-bold m-5">$USERNAME$</p>
                                {gender === 'male' && <IoMdMale className='fill-sky-500 text-2xl mt-5'/>}
                                {gender === 'female' && <IoMdFemale className='fill-pink-500 text-2xl mt-5'/>}
                            </div>
                            <div className="flex m-5 pt-5">
                                
                                <div className="rounded-2xl border-primary border pl-2 pr-2 mr-2">$TAG1$</div>
                                <div className="rounded-2xl border-primary border pl-2 pr-2  ">$TAG2$</div>
                            </div>         
                        </div>
                        
                    </div>
                
                    
                </div>
                <p className="text-gray-600 ml-4 mt-1 mb-10">$EMAIL$</p>
                <div className="flex flex-col">
                    <div className="text-3xl mb-8">Groups</div>
                    {/* Groups table */}
                    <table className="w-full">
                        <thead>
                            <tr>
                                <th className="border-b border-gray-300 text-left">Group Name</th>
                                <th className="border-b border-gray-300 text-left">Category</th>
                                <th className="border-b border-gray-300 text-left">Due</th>
                                <th className="border-b border-gray-300 text-left">Group Owner</th>
                                <th className="border-b border-gray-300 text-left">Member</th>
                                <th className="border-b border-gray-300 text-left">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="border-b border-gray-300 text-left">$GROUP_NAME$</td>
                                <td className="border-b border-gray-300 text-left">$CATEGORY$</td>
                                <td className="border-b border-gray-300 text-left">$DUE$</td>
                                <td className="border-b border-gray-300 text-left">$GROUP_OWNER$</td>
                                <td className="border-b border-gray-300 text-left">$MEMBER$</td>
                                <td className="border-b border-gray-300 text-left">$STATUS$</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

    );
};

export default PublicProfilePage;