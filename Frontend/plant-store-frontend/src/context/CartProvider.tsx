// context/cart/CartProvider.tsx
import { createContext, useState, useEffect } from "react";
import {
  getCart,
  addToCart as apiAddToCart,
  updateCartItem,
  removeCartItem,
  type CartItemDto,
} from "../api/cartApi";

interface CartContextType {
  cart: CartItemDto[];
  loading: boolean;
  totalQuantity: number;
  fetchCart: () => Promise<void>;
addItem: (
  product: {
    id: number;
    name: string;
    image: string;
    price: number;
    inStock?: number;
  },
  quantity: number
) => Promise<void>;

  updateItem: (productId: number, quantity: number) => Promise<void>;
  removeItem: (productId: number) => Promise<void>;
  clearCart: () => Promise<void>;
}

export const CartContext = createContext<CartContextType | null>(null);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartItemDto[]>([]);
  const [loading, setLoading] = useState(true);

  const token = JSON.parse(sessionStorage.getItem("auth") || "null")?.token;
  const isLoggedIn = !!token;

  const fetchCart = async () => {
    setLoading(true);
    try {
      if (isLoggedIn) {
        const data = await getCart();
        setCart(data);
      } else {
        const local = localStorage.getItem("cart");
        setCart(local ? JSON.parse(local) : []);
      }
    } finally {
      setLoading(false);
    }
  };

  const saveLocalCart = (items: CartItemDto[]) => {
    localStorage.setItem("cart", JSON.stringify(items));
    setCart(items);
  };

 const addItem = async (
  product: {
    id: number;
    name: string;
    image: string;
    price: number;
    inStock?: number;
  },
  quantity: number
) => {
  if (isLoggedIn) {
    await apiAddToCart({ productId: product.id, quantity });
    await fetchCart();
  } else {
    const stock = product.inStock ?? Infinity;
    const existing = cart.find((item) => item.productId === product.id);
    let updated: CartItemDto[];

    if (existing) {
      const newQty = Math.max(1, Math.min(16, existing.quantity + quantity, 16 - totalQuantity + existing.quantity, stock));
      updated = cart.map((item) =>
        item.productId === product.id
          ? { ...item, quantity: newQty, inStock: product.inStock ?? item.inStock }
          : item
      );
    } else {
      updated = [
        ...cart,
        {
          id: Date.now(),
          productId: product.id,
          productName: product.name,
          productImage: product.image,
          productPrice: product.price,
          quantity: Math.max(1, Math.min(quantity, 16 - totalQuantity, stock)),
          inStock: product.inStock,
        },
      ];
    }

    saveLocalCart(updated);
  }
};


  const updateItem = async (productId: number, quantity: number) => {
    if (isLoggedIn) {
      await updateCartItem(productId, quantity);
      await fetchCart();
    } else {
      const updated = cart.map((item) =>
        item.productId === productId
          ? { ...item, quantity: Math.max(1, Math.min(quantity, item.inStock ?? Infinity)) }
          : item
      );
      saveLocalCart(updated);
    }
  };

const removeItem = async (cartItemId: number) => {
  if (isLoggedIn) {
    await removeCartItem(cartItemId); // tu id z bazy
    await fetchCart();
  } else {
    const updated = cart.filter((item) => item.id !== cartItemId); // tu lokalny Date.now()
    saveLocalCart(updated);
  }
};

  const clearCart = async () => {
    if (isLoggedIn) {
      await Promise.all(cart.map((item) => removeCartItem(item.id)));
      setCart([]);
    } else {
      localStorage.removeItem("cart");
      setCart([]);
    }
    await fetchCart();
  };

  useEffect(() => {
    fetchCart();
  }, [token]);

  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        totalQuantity,
        fetchCart,
        addItem,
        updateItem,
        removeItem,
        clearCart,
      }}>
      {children}
    </CartContext.Provider>
  );
};
