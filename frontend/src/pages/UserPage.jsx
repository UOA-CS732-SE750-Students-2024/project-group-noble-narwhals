// This page is for the public profile page of a user, showing basic user information and their groups 
// where they are currently participating
import React from 'react';
import Navbar from '../components/Navbar.jsx';
import UserPageSideBar from '../components/UserPageSideBar.jsx';
import { Outlet } from 'react-router-dom';

const UserPage = () => {
    return (
        <div className="overflow-y-auto">
            <Navbar />
            <div className="flex pt-10 overflow-y-auto min-h-screen" >
                <UserPageSideBar />
                <div className="flex-grow" >
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default UserPage;