import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import ProfileSidebar from "../../components/User/ProfileSidebar";
import ProfileForm from "../../components/User/ProfileForm";
import OrdersList from "../../components/User/OrdersList";
import ChangePasswordModal from "../../components/User/ChangePasswordModal";

export default function ProfilePage() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<"profile" | "orders">("profile");
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  // 👇 Obsługa router state
  useEffect(() => {
    if (location.state?.tab === "orders") {
      setActiveTab("orders");
    }
  }, [location.state]);

  return (
    <div className="container mx-auto py-10 flex flex-col lg:flex-row gap-6">
      {/* Sidebar */}
      <div className="w-full lg:w-64">
        <ProfileSidebar
          activeTab={activeTab}
          onChangeTab={setActiveTab}
          onChangePassword={() => setShowPasswordModal(true)}
        />
      </div>

      {/* Main content */}
      <div className="flex-1">
        {activeTab === "profile" && <ProfileForm />}
        {activeTab === "orders" && <OrdersList />}
      </div>

      <ChangePasswordModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
      />
    </div>
  );
}
