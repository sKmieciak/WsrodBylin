interface Props {
  activeTab: "profile" | "orders";
  onChangeTab: (tab: "profile" | "orders") => void;
  onChangePassword: () => void;
}

export default function ProfileSidebar({ activeTab, onChangeTab, onChangePassword }: Props) {
  return (
    <div className="w-full lg:w-64 space-y-2">
      <h2 className="text-xl font-bold mb-4">Moje konto</h2>

      <button
        onClick={() => onChangeTab("profile")}
        className={`w-full text-left px-4 py-2 rounded ${
          activeTab === "profile" ? "bg-green-100 text-green-800 font-semibold" : "hover:bg-gray-100"
        }`}
      >
        Moje dane
      </button>

      <button
        onClick={() => onChangeTab("orders")}
        className={`w-full text-left px-4 py-2 rounded ${
          activeTab === "orders" ? "bg-green-100 text-green-800 font-semibold" : "hover:bg-gray-100"
        }`}
      >
        Historia zamówień
      </button>

      <button
        onClick={onChangePassword}
        className="w-full text-left px-4 py-2 rounded hover:bg-gray-100"
      >
        Zmień hasło
      </button>

      <button
        onClick={() => {
          // zakładam, że masz logout w useAuth
          const confirmLogout = confirm("Na pewno chcesz się wylogować?");
          if (confirmLogout) window.location.href = "/logout"; // lub useAuth().logout()
        }}
        className="w-full text-left px-4 py-2 rounded text-red-600 hover:bg-red-50"
      >
        Wyloguj się
      </button>
    </div>
  );
}
