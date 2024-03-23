import React from "react";
import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import UserProfilePage from "./pages/UserProfilePage";
import PublicProfilePage from "./pages/PublicProfilePage";
import AccountSettingsPage from "./pages/AccountSettingsPage";
import MyGroupsPage from "./pages/MyGroupsPage";
import ApplyInProgressPage from "./pages/ApplyInProgressPage";
import LikedGroupsPage from "./pages/LikedGroupsPage";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import advandedFormat from "dayjs/plugin/advancedFormat";


dayjs.extend(relativeTime);
dayjs.extend(advandedFormat);

function App() {
  return (
    <Routes>
      <Route path="/">
        <Route index element={<HomePage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="userProfile" element={<UserProfilePage />}>
          <Route path="publicProfile" element={<PublicProfilePage />}/>
          <Route path="accountSettings" element={<AccountSettingsPage />} />
          <Route path="myGroups"  element={<MyGroupsPage />}/>
          <Route path="applyInProgress" element={<ApplyInProgressPage />} />
          <Route path="likedGroups" element={<LikedGroupsPage />} />
          <Route path="notification"  />
        </Route>
          
      </Route>
    </Routes>
  );
}

export default App;
