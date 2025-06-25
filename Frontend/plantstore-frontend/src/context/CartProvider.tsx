// context/cart/CartContext.tsx
import { createContext, useState, useEffect } from "react";
import {
  getCart,
  addToCart as apiAddToCart,
  updateCartItem,
  removeCartItem,
} from "../api/cartApi";
import type { CartItemDto } from "../api/cartApi";

interface CartContextType {
  cart: CartItemDto[];
  loading: boolean;
  totalQuantity: number;
  fetchCart: () => Promise<void>;
  addItem: (productId: number, quantity: number) => Promise<void>;
  updateItem: (productId: number, quantity: number) => Promise<void>;
  removeItem: (cartItemId: number) => Promise<void>;
    clearCart: () => Promise<void>; 
}

export const CartContext = createContext<CartContextType | null>(null);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartItemDto[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    setLoading(true);
    try {
      const data = await getCart();
      setCart(data);
    } finally {
      setLoading(false);
    }
  };

  const addItem = async (productId: number, quantity: number) => {
    await apiAddToCart({ productId, quantity });
    await fetchCart();
  };

  const updateItem = async (productId: number, quantity: number) => {
    await updateCartItem(productId, quantity);
    await fetchCart();
  };

  const removeItem = async (cartItemId: number) => {
    await removeCartItem(cartItemId);
    await fetchCart();
  };
const clearCart = async () => {
  await Promise.all(cart.map((item) => removeItem(item.id)));
  await fetchCart();
};
  useEffect(() => {
    fetchCart();
  }, []);

  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        fetchCart,
        addItem,
        updateItem,
        removeItem,
        clearCart,
        totalQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
