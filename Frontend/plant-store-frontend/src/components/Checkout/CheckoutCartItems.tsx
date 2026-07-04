import { Trash2 } from "lucide-react";
import type { CartItem } from "../../types/CartItem";
import { API_URL } from "../../data/Api_URL";

interface Props {
  cart: CartItem[];
  updateItem: (productId: number, newQuantity: number) => void;
  removeItem: (itemId: number) => void;
}

export default function CheckoutCartItems({ cart, updateItem, removeItem }: Props) {
  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="bg-white border rounded-xl shadow p-4 mb-8">
      {cart.map((item) => {
        const imageUrl = item.productImage.startsWith("http")
          ? item.productImage
          : `${API_URL}${item.productImage.startsWith("/") ? "" : "/"}${item.productImage}`;

        return (
          <div
            key={item.id}
            className="flex items-center gap-3 border-b last:border-none py-4"
          >
            <img
              src={imageUrl || "/images/placeholder.svg"}
              alt={item.productName}
              onError={(e) => { e.currentTarget.src = "/images/placeholder.svg"; }}
              className="w-14 h-14 object-cover rounded border flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm truncate">{item.productName}</div>
              <div className="text-xs text-gray-500">{item.productPrice.toFixed(2)} zł / szt.</div>
            </div>

            <div className="flex items-center gap-1 flex-shrink-0">
              <button
                onClick={() => updateItem(item.productId, Math.max(1, item.quantity - 1))}
                className="w-7 h-7 flex items-center justify-center border rounded bg-gray-100 text-lg font-semibold"
              >
                -
              </button>
              <span className="w-6 text-center text-sm">{item.quantity}</span>
              <button
                onClick={() => updateItem(item.productId, item.quantity + 1)}
                disabled={totalQuantity >= 16}
                className="w-7 h-7 flex items-center justify-center border rounded bg-gray-100 text-lg font-semibold disabled:opacity-40 disabled:cursor-not-allowed"
              >
                +
              </button>
            </div>

            <div className="font-semibold text-sm w-16 text-right flex-shrink-0">
              {(item.quantity * item.productPrice).toFixed(2)} zł
            </div>

            <button onClick={() => removeItem(item.id)} className="flex-shrink-0 ml-1">
              <Trash2 className="text-red-500 w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
