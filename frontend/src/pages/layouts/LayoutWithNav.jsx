import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../../components/Navbar";

export default function PageLayout() {
  return (
    <>
      <Navbar isLogged={true} />
      <Outlet />
    </>
  );
}
