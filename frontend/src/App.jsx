import React from "react";
import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import advandedFormat from "dayjs/plugin/advancedFormat";
import SearchPage from "./pages/SearchPage";
import NotificationPage from "./pages/NotificationPage";

dayjs.extend(relativeTime);
dayjs.extend(advandedFormat);

function App() {
  return (
    <Routes>
      <Route path="/">
        <Route index element={<HomePage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="search" element={<SearchPage />} />
        <Route path="notification" element={<NotificationPage />} />
      </Route>
    </Routes>
  );
}

export default App;
