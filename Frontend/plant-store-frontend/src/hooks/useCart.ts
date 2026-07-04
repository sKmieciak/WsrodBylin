// context/cart/useCart.ts
import { useContext } from "react";
import { CartContext } from "../context/CartProvider";

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");

  // 👉 Wracamy do znanego API
  return {
    cart: context.cart,
    loading: context.loading,
    addToCart: context.addItem,
    updateItem: context.updateItem,
    removeItem: context.removeItem,
    refresh: context.fetchCart,
    clearCart: context.clearCart,
    totalQuantity: context.totalQuantity,
  };
};
