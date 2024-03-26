// This page is for the public profile page of a user, showing basic user information and their groups 
// where they are currently participating
import React from 'react';
import { useState } from 'react';
import Navbar from '../components/Navbar.jsx';
import { NAV_HEIGHT } from '../utils/constants.js'; 
import UserPageSideBar from '../components/UserPageSideBar.jsx';
import { Outlet } from 'react-router-dom';

const UserPage = () => {
    const [contentHeight, setContentHeight] = useState(`calc(100vh - ${NAV_HEIGHT}px)`);
    return (
        <div className="overflow-y-auto">
            <Navbar />
            <div className="flex overflow-y-auto" style={{ minHeight: contentHeight }}>
                <UserPageSideBar />
                <div className="flex-grow" style={{ minHeight: contentHeight }}>
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default UserPage;