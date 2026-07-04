import { Outlet } from "react-router-dom";
import Sidebar from "../admin/components/Sidebar";
import Topbar from "../admin/components/Topbar";

export default function AdminLayout() {
  return (
    <div className="flex flex-col lg:flex-row h-screen bg-gray-50 relative">
      <Sidebar />
      <div className="flex flex-col flex-1 min-h-0">
        <div className="hidden lg:block">
          <Topbar />
        </div>
        <main className="p-4 lg:p-6 overflow-y-auto flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
