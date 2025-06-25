import { useCart } from "../../hooks/useCart";
import CartItem from "../../components/Cart/CartItem";
import { useState } from "react";
import { CheckCircle, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom"; // <--- DODAJ TO

export default function CartPage() {
  const { cart, updateItem, removeItem } = useCart();
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate(); // <--- DODAJ TO

  const total = cart.reduce(
    (sum, item) => sum + item.productPrice * item.quantity,
    0
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
        <ShoppingBag className="w-8 h-8 text-green-600" />
        Koszyk
      </h1>

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

          <div className="flex flex-col md:flex-row justify-end items-end md:items-center mt-8 gap-4">
            <div className="text-xl font-semibold">
              Suma:{" "}
              <span className="text-green-600 font-bold">
                {total.toFixed(2)} zł
              </span>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="bg-green-600 hover:bg-green-700 text-white text-lg font-semibold px-6 py-3 rounded-xl transition duration-300 shadow"
            >
              Przejdź do zamówienia
            </button>
          </div>
        </>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl p-8 shadow-lg w-[90%] max-w-md text-center">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Gotowy do zamówienia?</h2>
            <p className="text-gray-600 mb-6">
              Przejdziesz do podsumowania i finalizacji zakupu.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
              >
                Anuluj
              </button>
              <button
                onClick={() => {
                  setShowModal(false);
                  navigate("/checkout"); 
                }}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Kontynuuj
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
