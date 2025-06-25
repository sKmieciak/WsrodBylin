import { Outlet } from "react-router-dom";
import Sidebar from "../admin/components/Sidebar";
import Topbar from "../admin/components/Topbar";

export default function AdminLayout() {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Topbar />
        <main className="p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
