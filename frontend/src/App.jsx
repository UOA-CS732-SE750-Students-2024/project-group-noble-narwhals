import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import advandedFormat from "dayjs/plugin/advancedFormat";
import LayoutWithNav from "./pages/layouts/LayoutWithNav";
import GroupInfoPage from "./pages/group/GroupInfoPage";
import CreateGroupPage from "./pages/group/CreateGroupPage";
import LayoutUserPages from "./pages/layouts/LayoutUserPages";
import PublicProfilePage from "./pages/user/PublicProfilePage";
import AccountSettingPage from "./pages/user/AccountSettingPage";
import ApplyInProgressPage from "./pages/user/ApplyInProgressPage";
import LikedGroupPage from "./pages/user/LikedGroupPage";
import NotificationPage from "./pages/user/NotificationPage";
import SearchPage from "./pages/SearchPage";

dayjs.extend(relativeTime);
dayjs.extend(advandedFormat);

function App() {
  return (
    <Routes>
      <Route path="login" element={<LoginPage />} />
      <Route path="signup" element={<LoginPage ifLogin={false} />} />
      <Route path="*" element={<p>404</p>} />
      <Route path="/" element={<LayoutWithNav />}>
        <Route index element={<HomePage />} />
        <Route path="group/:groupId" element={<GroupInfoPage />} />
        <Route path="search" element={<SearchPage />} />
        <Route path="creategroup" element={<CreateGroupPage />} />
      </Route>
      <Route path="user" element={<LayoutUserPages />}>
        <Route index element={<Navigate to={"profile"} replace />} />
        <Route path="profile" element={<PublicProfilePage />} />
        <Route path="settings" element={<AccountSettingPage />} />
        <Route path="apply-in-progress" element={<ApplyInProgressPage />} />
        <Route path="liked" element={<LikedGroupPage />} />
        <Route path="notification" element={<NotificationPage />} />
      </Route>
    </Routes>
  );
}

export default App;
