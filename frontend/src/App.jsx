import React from "react";
import { Route, Routes } from "react-router-dom";
import { Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import Userpage from "./pages/UserPage";
import PublicProfilePage from "./pages/PublicProfilePage";
import AccountSettingsPage from "./pages/AccountSettingsPage";
// import MyGroupsPage from "./pages/MyGroupsPage";
import ApplyInProgressPage from "./pages/ApplyInProgressPage";
import LikedGroupsPage from "./pages/LikedGroupsPage";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import advandedFormat from "dayjs/plugin/advancedFormat";
import LayoutWithNav from "./components/LayoutWithNav";


dayjs.extend(relativeTime);
dayjs.extend(advandedFormat);

function App() {
  return (
    <Routes>
      <Route path="/" element={<LayoutWithNav  />}>
        <Route index element={<HomePage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="*" element={<p>404</p>} />
        <Route path="user" element={<Userpage />}>
          <Route index element={<Navigate to= "profile" replace/>}/>
          <Route path="profile" element={<PublicProfilePage />} />
          <Route path="settings" element={<AccountSettingsPage />} />
          {/* <Route path="my-groups"  element={<MyGroupsPage />}/> */}
          <Route path="apply-in-progress" element={<ApplyInProgressPage />} />
          <Route path="liked" element={<LikedGroupsPage />} />
          <Route path="notification"  />
        </Route>
          
      </Route>
    </Routes>
  );
}

export default App;
