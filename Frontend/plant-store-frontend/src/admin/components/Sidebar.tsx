import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Package, ShoppingCart, Users, Star, BadgePercent, Menu, X, Settings, Bell, BellOff, ScrollText } from "lucide-react";
import { usePushNotifications } from "../../hooks/usePushNotifications";

const isIosWithoutPwa =
  typeof navigator !== "undefined" &&
  /iphone|ipad|ipod/i.test(navigator.userAgent) &&
  !(window.navigator as any).standalone;

const links = [
  { to: "/admin/products", label: "Produkty", icon: <Package size={18} /> },
  { to: "/admin/orders", label: "Zamówienia", icon: <ShoppingCart size={18} /> },
  { to: "/admin/users", label: "Użytkownicy", icon: <Users size={18} /> },
  { to: "/admin/reviews", label: "Opinie", icon: <Star size={18} /> },
  { to: "/admin/promotions", label: "Promocje", icon: <BadgePercent size={18} /> },
  { to: "/admin/settings", label: "Ustawienia", icon: <Settings size={18} /> },
  { to: "/admin/audit", label: "Logi", icon: <ScrollText size={18} /> },
];

function PushButton({ compact = false }: { compact?: boolean }) {
  const { status, subscribe, unsubscribe } = usePushNotifications();
  const [showHint, setShowHint] = useState(false);

  // iOS bez PWA — pokaż instrukcję
  if (isIosWithoutPwa) {
    const hint = (
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-gray-700">
        <p className="font-semibold mb-1">📱 Powiadomienia na iPhone</p>
        <p>Dodaj stronę do ekranu głównego: Safari → <strong>Udostępnij</strong> → <strong>Dodaj do ekranu głównego</strong>, potem otwórz stamtąd i włącz powiadomienia.</p>
      </div>
    );
    if (compact) return (
      <div className="relative">
        <button
          onClick={() => setShowHint(v => !v)}
          className="p-1.5 rounded-md text-amber-500 hover:bg-amber-50"
        >
          <BellOff size={20} />
        </button>
        {showHint && (
          <div className="absolute right-0 top-10 w-64 z-50 shadow-lg" onClick={() => setShowHint(false)}>
            {hint}
          </div>
        )}
      </div>
    );
    return <div className="px-2 pb-2">{hint}</div>;
  }

  const isOn = status === "subscribed";
  const isLoading = status === "loading";
  const disabled = isLoading || status === "unsupported" || status === "denied";

  if (compact) {
    return (
      <button
        onClick={!disabled ? (isOn ? unsubscribe : subscribe) : undefined}
        title={isOn ? "Wyłącz powiadomienia" : "Włącz powiadomienia"}
        className={`p-1.5 rounded-md transition ${
          isOn ? "text-green-600 hover:bg-green-50" :
          disabled ? "text-gray-300" : "text-gray-400 hover:bg-gray-100"
        }`}
      >
        {isOn ? <Bell size={20} /> : <BellOff size={20} />}
      </button>
    );
  }

  return (
    <button
      onClick={!disabled ? (isOn ? unsubscribe : subscribe) : undefined}
      className={`flex items-center gap-2 p-2 rounded-md w-full text-sm font-medium transition ${
        isOn ? "text-green-700 bg-green-50 hover:bg-green-100" :
        disabled ? "text-gray-300 cursor-default" : "text-gray-600 hover:bg-gray-100"
      }`}
    >
      {isOn ? <Bell size={18} /> : <BellOff size={18} />}
      {isLoading ? "Sprawdzanie..." : isOn ? "Powiadomienia wł." : "Włącz powiadomienia"}
    </button>
  );
}

export default function Sidebar() {
  const [open, setOpen] = useState(false);

  const navLinks = links.map((link) => (
    <NavLink
      key={link.to}
      to={link.to}
      onClick={() => setOpen(false)}
      className={({ isActive }) =>
        `flex items-center gap-2 p-2 rounded-md hover:bg-gray-100 ${isActive ? "bg-gray-200 font-medium" : ""}`
      }
    >
      {link.icon}
      {link.label}
    </NavLink>
  ));

  return (
    <>
      {/* Mobile top bar */}
      <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-white border-b shadow-sm">
        <span className="font-bold text-lg">Admin Panel</span>
        <div className="flex items-center gap-2">
          <PushButton compact />
          <button onClick={() => setOpen(!open)} className="p-1">
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="lg:hidden absolute top-[56px] left-0 right-0 bg-white shadow-md z-50 border-b">
          <nav className="flex flex-col gap-1 p-4">
            {navLinks}
            <div className="mt-2 border-t pt-2">
              <PushButton />
            </div>
          </nav>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-white shadow-md border-r">
        <div className="p-4 text-xl font-bold">Admin Panel</div>
        <nav className="flex flex-col gap-1 px-4">
          {navLinks}
          <div className="mt-2 border-t pt-2">
            <PushButton />
          </div>
        </nav>
      </aside>
    </>
  );
}
