import { Link } from "react-router-dom";

interface Props {
  onClose: () => void;
  onLogout: () => void;
}

export default function UserMenu({ onClose, onLogout }: Props) {
  return (
    <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-md z-50">
      <Link
        to="/profile"
        className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50"
        onClick={onClose}>
        Mój profil
      </Link>
      <Link
        to="/profile"
        state={{ tab: "orders" }}
        className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50"
        onClick={onClose}>
        Historia zamówień
      </Link>

      <button
        onClick={onLogout}
        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">
        Wyloguj się
      </button>
    </div>
  );
}
