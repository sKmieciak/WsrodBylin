// src/admin/components/Sidebar.tsx
import { NavLink } from "react-router-dom";
import { Package, ShoppingCart, Users, Folder, Star } from "lucide-react";

const links = [
  { to: "/admin/products", label: "Produkty", icon: <Package size={18} /> },
  { to: "/admin/orders", label: "Zamówienia", icon: <ShoppingCart size={18} /> },
  { to: "/admin/categories", label: "Kategorie", icon: <Folder size={18} /> },
  { to: "/admin/users", label: "Użytkownicy", icon: <Users size={18} /> },
  { to: "/admin/reviews", label: "Opinie", icon: <Star size={18} /> },
];

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white shadow-md border-r">
      <div className="p-4 text-xl font-bold">Admin Panel</div>
      <nav className="flex flex-col gap-1 px-4">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center gap-2 p-2 rounded-md hover:bg-gray-100 ${
                isActive ? "bg-gray-200 font-medium" : ""
              }`
            }
          >
            {link.icon}
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
