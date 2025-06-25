import CartItem from "./CartItem";
import type { CartItemDto } from "../../types/Cart";

interface CartDrawerItemListProps {
  cart: CartItemDto[];
  updateItem: (productId: number, quantity: number) => Promise<void>;
  removeItem: (cartItemId: number) => Promise<void>;
}

export default function CartDrawerItemList({
  cart,
  updateItem,
  removeItem,
}: CartDrawerItemListProps) {
  return (
    <div className="p-4 overflow-y-auto h-[calc(100%-160px)] space-y-4">
      {cart.length === 0 ? (
        <p className="text-sm text-gray-500">Koszyk jest pusty.</p>
      ) : (
        cart.map((item) => (
          <CartItem
            key={item.id}
            item={item}
            updateItem={updateItem}
            removeItem={removeItem}
          />
        ))
      )}
    </div>
  );
}
