import { createContext, useContext, useEffect, useState } from "react";
import { API_URL } from "../data/Api_URL";
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

const API_BASE = API_URL;

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [, setToken] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("auth");
    if (stored) {
      const { user, token } = JSON.parse(stored);
      setUser(user);
      setToken(token);

      fetch(`${API_BASE}api/user/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          if (!res.ok) throw new Error("Unauthorized");
          return res.json();
        })
        .then((userData) => setUser(userData))
        .catch(() => {
          console.warn("Błąd autoryzacji – wylogowano.");
          logout();
        });
    }
  }, []);

  const persist = (user: User, token: string) => {
    localStorage.setItem("auth", JSON.stringify({ user, token }));
    setUser(user);
    setToken(token);
  };

  const login = async (email: string, password: string) => {
    const res = await fetch(`${API_BASE}api/Auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) throw new Error("Błąd logowania");

    const { token, name, email: returnedEmail } = await res.json();

    persist({ name, email: returnedEmail }, token);
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
    const res = await fetch(`${API_BASE}api/Auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
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
      }),
    });

    if (!res.ok) throw new Error("Błąd rejestracji");

    const { token, name, email: returnedEmail } = await res.json();
    persist({ name, email: returnedEmail }, token);
  };

  const logout = () => {
    localStorage.removeItem("auth");
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
