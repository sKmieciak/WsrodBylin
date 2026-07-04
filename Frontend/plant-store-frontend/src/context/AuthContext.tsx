import { createContext, useContext, useEffect, useState } from "react";
import axiosInstance from "../lib/axios";
import { addToCart } from "../api/cartApi";
import type { CartItemDto } from "../api/cartApi";

interface User {
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    phoneNumber: string,
    street: string,
    houseNumber: string,
    postalCode: string,
    city: string,
    country: string,
    addressAddon: string,
    isCompanyAccount: boolean
  ) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [, setToken] = useState<string | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("auth");
    if (stored) {
      const { user, token } = JSON.parse(stored);
      setUser(user);
      setToken(token);

      axiosInstance
        .get("api/user/me")
        .then((res) => setUser(res.data))
        .catch(() => {
          console.warn("Błąd autoryzacji – wylogowano.");
          logout();
        });
    }
  }, []);

  const persist = (user: User, token: string) => {
    sessionStorage.setItem("auth", JSON.stringify({ user, token }));
    setUser(user);
    setToken(token);
  };

  const mergeGuestCart = async () => {
    const raw = localStorage.getItem("cart");
    if (!raw) return;
    const localCart: CartItemDto[] = JSON.parse(raw);
    if (!localCart.length) return;
    await Promise.allSettled(
      localCart.map((item) => addToCart({ productId: item.productId, quantity: item.quantity }))
    );
    localStorage.removeItem("cart");
  };

  const login = async (email: string, password: string) => {
    const res = await axiosInstance.post("api/Auth/login", { email, password });
    const { token, name, email: returnedEmail } = res.data;
    persist({ name, email: returnedEmail }, token);
    await mergeGuestCart();
  };

  const register = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    phoneNumber: string,
    street: string,
    houseNumber: string,
    postalCode: string,
    city: string,
    country: string,
    addressAddon: string,
    isCompanyAccount: boolean
  ) => {
    const res = await axiosInstance.post("api/Auth/register", {
      email,
      password,
      firstName,
      lastName,
      phoneNumber,
      street,
      houseNumber,
      postalCode,
      city,
      country,
      addressAddon,
      isCompanyAccount,
    });
    const { token, name, email: returnedEmail } = res.data;
    persist({ name, email: returnedEmail }, token);
    await mergeGuestCart();
  };

  const logout = () => {
    sessionStorage.removeItem("auth");
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
};
