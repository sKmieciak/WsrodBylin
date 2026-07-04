import { useEffect, useState } from "react";
import { getMe, updateUser } from "../api/userApi";
import type { UserDto, UpdateUserDto } from "../types/User";

export const useUser = () => {
  const [user, setUser] = useState<UserDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isLoggedIn = !!JSON.parse(sessionStorage.getItem("auth") || "null")?.token;

  const fetchUser = async () => {
    if (!isLoggedIn) {
      setLoading(false);
      return;
    }
    try {
      const data = await getMe();
      setUser(data);
    } catch {
      setError("Nie udało się pobrać danych użytkownika.");
    } finally {
      setLoading(false);
    }
  };

  const update = async (updated: UpdateUserDto) => {
    await updateUser(updated);
    await fetchUser();
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return { user, loading, error, update };
};
