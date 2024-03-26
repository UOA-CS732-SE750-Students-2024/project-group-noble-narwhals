import React, { useState } from 'react';
import SidebarOption from './SideBarOption';
import { CgProfile } from "react-icons/cg";
import { CiSettings } from "react-icons/ci";
import { FaUserGroup } from "react-icons/fa6";
import { MdPendingActions } from "react-icons/md";
import { FaHeart } from "react-icons/fa";
import { IoIosNotifications } from "react-icons/io";



function UserPageSideBar() {
    const [selectedOption, setSelectedOption] = useState('');

    const handleOptionClick = (option) => {
        setSelectedOption(option);
    };

    const options = [
        { label: 'Public Profile', icon: <CgProfile className="mr-2" />, to: '/user/profile' },
        { label: 'Account settings', icon: <CiSettings className="mr-2" size={24} />, to: '/user/settings' },
        { label: 'My groups', icon: <FaUserGroup className="mr-2" />, to: '/user/my-groups' },
        { label: 'Apply in progress', icon: <MdPendingActions className="mr-2" size={18} />, to: '/user/apply-in-progress' },
        { label: 'Liked groups', icon: <FaHeart className="mr-2" />, to: '/user/liked' },
        { label: 'Notification', icon: <IoIosNotifications className="mr-1" size={24} />, to: '/user/notification' },
    ];

    return (
        <div className="w-1/6 min-w-fit overflow-y-auto bg-primary flex flex-col items-center ">
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
                {options.map((option) => (
                    <SidebarOption
                        key={option.label}
                        label={option.label}
                        icon={option.icon}
                        to={option.to}
                        handleClick={handleOptionClick}
                    />
                ))}
            </div>
        </div>
    );
};
export default UserPageSideBar;