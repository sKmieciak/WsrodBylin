import type { CartItemDto } from "../../types/Cart";
import { Trash2 } from "lucide-react";

interface CartItemProps {
  item: CartItemDto;
  updateItem: (productId: number, quantity: number) => Promise<void>;
  removeItem: (cartItemId: number) => Promise<void>;
}

export default function CartItem({ item, updateItem, removeItem }: CartItemProps) {
  return (
    <div className="flex items-center gap-4 p-3 bg-white rounded-xl shadow-sm border">
      <img
        src={item.productImage}
        alt={item.productName}
        className="w-16 h-16 object-cover rounded"
      />

      <div className="flex flex-col flex-1">
        <p className="font-semibold text-sm md:text-base leading-tight">{item.productName}</p>
        <p className="text-xs text-gray-500 mt-1">
          {item.productPrice.toFixed(2)} zł x {item.quantity}
        </p>
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={() => updateItem(item.productId, Math.max(1, item.quantity - 1))}
          className="px-2 py-1 border rounded text-lg font-semibold hover:bg-gray-100"
        >
          –
        </button>
        <span className="px-2 min-w-[24px] text-center">{item.quantity}</span>
        <button
          onClick={() => updateItem(item.productId, item.quantity + 1)}
          className="px-2 py-1 border rounded text-lg font-semibold hover:bg-gray-100"
        >
          +
        </button>
        <button onClick={() => removeItem(item.id)} className="ml-2">
          <Trash2 className="w-5 h-5 text-red-500 hover:text-red-700" />
        </button>
      </div>
    </div>
  );
}
