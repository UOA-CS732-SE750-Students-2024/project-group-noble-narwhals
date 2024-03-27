import React from 'react';
import { Outlet } from "react-router-dom";
import UserPageSideBar from '../../components/UserPageSideBar.jsx';

export default function LayoutUserPages() {
  return (
    <div className="overflow-y-auto">
     <div className="flex pt-10 overflow-y-auto min-h-screen" > {/**May delete the "pt-10" after adding a placeholder to the nav bar */}
                <UserPageSideBar />
                <div className="flex-grow" >
                    <Outlet />
                </div>
            </div>
    </div>
  );
}

