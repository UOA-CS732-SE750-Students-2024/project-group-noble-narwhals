// This page is for the public profile page of a user, showing basic user information and their groups 
// where they are currently participating
import React from 'react';
import Navbar from '../components/Navbar.jsx';
import UserPageSideBar from '../components/UserPageSideBar.jsx';

import { Outlet } from 'react-router-dom';

const UserProfilePage = () => {
    return (
        <div className="h-screen overflow-y-auto ">
            <Navbar />
            <div className="flex ">
                <UserPageSideBar />
                <div className="flex-grow">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default UserProfilePage;