import React from "react";
import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import GroupInfo from "./pages/GroupInfo";
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
        <Route path="group/:groupId" element={<GroupInfo />} />
      </Route>
      <Route path="login" element={<LoginPage />} />
      <Route path="*" element={<p>404</p>} />
    </Routes>
  );
}

export default App;
