import { useCart } from "../../hooks/useCart";
import CartItem from "../../components/Cart/CartItem";
import { ShoppingBag, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { usePageTitle } from "../../hooks/usePageTitle";

export default function CartPage() {
  usePageTitle("Koszyk");
  const { cart, updateItem, removeItem } = useCart();
  const navigate = useNavigate();

  const total = cart.reduce(
    (sum, item) => sum + item.productPrice * item.quantity,
    0
  );

  const handleCheckout = () => navigate("/checkout");

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 pb-32 md:pb-8">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="sm:hidden p-2 rounded-full hover:bg-gray-100">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <ShoppingBag className="w-8 h-8 text-green-600" />
          Koszyk
        </h1>
      </div>

      {cart.length === 0 ? (
        <p className="text-gray-600">Twój koszyk jest pusty.</p>
      ) : (
        <>
          <div className="space-y-6">
            {cart.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                updateItem={updateItem}
                removeItem={removeItem}
              />
            ))}
          </div>

          {/* Desktop — przycisk w treści */}
          <div className="hidden md:flex justify-end items-center mt-8 gap-4">
            <div className="text-xl font-semibold">
              Suma: <span className="text-green-600 font-bold">{total.toFixed(2)} zł</span>
            </div>
            <button
              onClick={handleCheckout}
              className="bg-green-600 hover:bg-green-700 text-white text-lg font-semibold px-6 py-3 rounded-xl transition duration-300 shadow"
            >
              Przejdź do zamówienia
            </button>
          </div>
        </>
      )}

      {/* Mobile — sticky bar na dole */}
      {cart.length > 0 && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg px-4 py-3 z-[60]">
          <div className="flex items-center justify-between gap-3">
            <span className="text-base font-semibold">
              Suma: <span className="text-green-600">{total.toFixed(2)} zł</span>
            </span>
            <button
              onClick={handleCheckout}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-xl transition"
            >
              Przejdź do zamówienia
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
