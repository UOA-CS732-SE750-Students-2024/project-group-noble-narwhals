import { Outlet } from "react-router-dom";
import Navbar from "../../components/Navbar";

export default function LayoutUserPages() {
  return (
    <div >
      <Navbar isLogged={true} />
      This is LayoutUserPages
      <div>
        <Outlet />
      </div>
    </div>
  );
}
