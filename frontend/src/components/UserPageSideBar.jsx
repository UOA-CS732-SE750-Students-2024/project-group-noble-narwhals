import React, { useState } from 'react';
import {Link} from 'react-router-dom';

import { CgProfile } from "react-icons/cg";
import { CiSettings } from "react-icons/ci";
import { FaUserGroup } from "react-icons/fa6";
import { MdPendingActions } from "react-icons/md";
import { FaHeart } from "react-icons/fa";
import { IoIosNotifications } from "react-icons/io";


function UserPageSideBar(){
    const [selectedOption, setSelectedOption] = useState('');

    const handleOptionClick = (option) => {
        setSelectedOption(option);
    };

    return (
        <div className="w-1/6 bg-primary min-h-screen flex flex-col items-center ">
            <div>{/*users' avatar and username*/}
                <div className="flex flex-col items-center justify-center p-8">
                    <img
                        className="w-24 h-24 rounded-full mb-2"
                        src="https://www.animesenpai.net/wp-content/uploads/2022/12/Bocchi-The-Rock-21-1024x576.webp"
                        alt="User Avatar"
                    />
                    <div>
                        <p className="text-xl text-white font-bold">Username</p>
                    </div>
                </div>
                        
            </div>
            <div className="w-full">
                <div 
                    className={`p-3 flex items-center justify-center hover:bg-secondary ${selectedOption === 'Public profile' ? 'bg-secondary text-white' : 'text-white'} cursor-pointer transition-colors duration-100`}
                    onClick={() => handleOptionClick('Public profile')}
                >
                    <Link to="/userProfile/publicProfile" className="flex items-center w-full justify-start pl-4">
                        <CgProfile className="mr-2"/>Public Profile
                    </Link>
                </div>
                <div 
                    className={`p-3 flex items-center justify-center hover:bg-secondary ${selectedOption === 'Account settings' ? 'bg-secondary text-white' : 'text-white'} cursor-pointer transition-colors duration-100`}
                    onClick={() => handleOptionClick('Account settings')}
                >
                    <Link to="/userProfile/accountSettings" className="flex items-center w-full justify-start pl-3"> {/* use pl-3 to adjust. because some icon from react-icon have different size */}
                        <CiSettings className="mr-2" size={24}/>Account settings
                    </Link>
                </div>
                <div 
                    className={`p-3 flex items-center justify-center hover:bg-secondary ${selectedOption === 'My groups' ? 'bg-secondary text-white' : 'text-white'} cursor-pointer transition-colors duration-100`}
                    onClick={() => handleOptionClick('My groups')}
                >
                    <Link to="/userProfile/myGroups" className="flex items-center w-full justify-start pl-4"> 
                        <FaUserGroup className="mr-2"/>My groups
                    </Link>
                </div>
                <div 
                    className={`p-3 flex items-center justify-center hover:bg-secondary ${selectedOption === 'Apply in progress' ? 'bg-secondary text-white' : 'text-white'} cursor-pointer transition-colors duration-100`}
                    onClick={() => handleOptionClick('Apply in progress')}
                >
                     <Link to="/userProfile/applyInProgress" className="flex items-center w-full justify-start pl-4"> 
                        <MdPendingActions className="mr-2" size={18}/>Apply in progress
                    </Link>
                </div>
                <div 
                    className={`p-3 flex items-center justify-center hover:bg-secondary ${selectedOption === 'Liked groups' ? 'bg-secondary text-white' : 'text-white'} cursor-pointer transition-colors duration-100`}
                    onClick={() => handleOptionClick('Liked groups')}
                >
                     <Link to="/userProfile/likedGroups" className="flex items-center w-full justify-start pl-4"> 
                        <FaHeart className="mr-2"/>Liked groups
                    </Link>
                </div>
                <div 
                    className={`p-3 flex items-center justify-center hover:bg-secondary ${selectedOption === 'Notification' ? 'bg-secondary text-white' : 'text-white'} cursor-pointer transition-colors duration-100`}
                    onClick={() => handleOptionClick('Notification')}
                >
                     <Link to="/userProfile/notification" className="flex items-center w-full justify-start pl-3"> 
                        <IoIosNotifications className="mr-1" size={24}/>Notification
                    </Link>
                </div>
            </div>
        </div>
    );
};
export default UserPageSideBar;