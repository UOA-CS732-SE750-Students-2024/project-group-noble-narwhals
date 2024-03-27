import { Outlet } from "react-router-dom";

export default function LayoutUserPages() {
  return (
    <div className="mt-16">
      This is LayoutUserPages
      <div>
        <Outlet />
      </div>
    </div>
  );
}
