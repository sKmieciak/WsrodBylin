import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, User, Home as HomeIcon } from "lucide-react";
import LoginModal from "../LoginModal/LoginModal";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../hooks/useCart";
import CartDrawer from "../Cart/CartDrawer";
import UserButton from "../User/UserButton";
import UserMenu from "../User/UserMenu";
import { getTokenData } from "../../utils/getTokenData"; // ✅ nowy import

export const Navbar = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const { user, logout } = useAuth();
  const { cart } = useCart();

  const tokenData = getTokenData();
  const isAdmin = tokenData?.isAdmin;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
<header className="w-full bg-card text-foreground border-b border-border py-4 sm:py-6">
        <div className="container max-w-screen-2xl mx-auto px-4">
  <div className="w-full px-4 sm:px-6 lg:px-20 flex items-center justify-between relative">
    {/* Left */}
    <div className="w-1/4">
      <Link
        to="/"
        title="Strona główna"
        className="flex items-center justify-start p-2 rounded-full hover:bg-green-50 transition"
      >
        <HomeIcon className="w-6 h-6 text-green-700" />
      </Link>
    </div>

    {/* Center */}
    <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
      <img
        src="/logo.png"
        alt="Wśród Bylin"
        className="max-h-64 sm:max-h-64 w-auto drop-shadow-md pointer-events-none"
      />
    </div>

    {/* Right */}
    <div className="w-1/4 flex justify-end items-center space-x-2 sm:space-x-4 relative">
      {user ? (
        <div className="relative" ref={menuRef}>
          <UserButton name={user.name} onClick={() => setShowMenu(!showMenu)} />
          {showMenu && (
            <UserMenu
              onClose={() => setShowMenu(false)}
              onLogout={() => {
                logout();
                setShowMenu(false);
              }}
            />
          )}
        </div>
      ) : (
        <button
          onClick={() => setShowLogin(true)}
          title="Zaloguj się"
          className="flex items-center justify-center p-2 rounded-full hover:bg-green-50 transition"
        >
          <User className="w-6 h-6 text-gray-700 hover:text-green-700 transition" />
        </button>
      )}

      {isAdmin && (
        <Link
          to="/admin"
          className="hidden sm:inline-block px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition text-sm"
        >
          Panel admina
        </Link>
      )}

      <button
        onClick={() => setShowCart(true)}
        title="Koszyk"
        className="flex items-center justify-center p-2 rounded-full hover:bg-green-50 transition relative"
      >
        <ShoppingCart className="w-6 h-6 text-gray-700 hover:text-green-700 transition" />
        {cart.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs px-1.5 py-0.5 rounded-full">
            {cart.length}
          </span>
        )}
      </button>
    </div>
  </div>
  </div>
</header>


      <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />
      <CartDrawer isOpen={showCart} onClose={() => setShowCart(false)} />
    </>
  );
};
