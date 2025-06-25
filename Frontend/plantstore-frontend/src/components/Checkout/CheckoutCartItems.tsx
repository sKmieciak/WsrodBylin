import { Trash2 } from "lucide-react";
import type { CartItem } from "../../types/CartItem";

interface Props {
  cart: CartItem[];
  updateItem: (productId: number, newQuantity: number) => void;
  removeItem: (itemId: number) => void;
}

export default function CheckoutCartItems({ cart, updateItem, removeItem }: Props) {
  return (
    <div className="bg-white border rounded-xl shadow p-4 mb-8">
      {cart.map((item) => (
        <div
          key={item.id}
          className="flex items-center justify-between border-b last:border-none py-4"
        >
          <div className="flex gap-4 items-center">
            <img
              src={item.productImage}
              alt={item.productName}
              className="w-16 h-16 object-cover rounded border"
            />
            <div>
              <div className="font-semibold">{item.productName}</div>
              <div className="text-sm text-gray-500">Brak wariantów</div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-sm font-medium">{item.productPrice.toFixed(2)} PLN</div>
            <div className="flex items-center border rounded overflow-hidden">
              <button
                onClick={() => updateItem(item.productId, Math.max(1, item.quantity - 1))}
                className="px-2 py-1 bg-gray-100"
              >
                -
              </button>
              <span className="px-4">{item.quantity}</span>
              <button
                onClick={() => updateItem(item.productId, item.quantity + 1)}
                className="px-2 py-1 bg-gray-100"
              >
                +
              </button>
            </div>
            <div className="font-semibold text-gray-700">
              {(item.quantity * item.productPrice).toFixed(2)} PLN
            </div>
            <button onClick={() => removeItem(item.id)}>
              <Trash2 className="text-red-500 w-5 h-5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
