import { useEffect, useState } from "react";
import {
  fetchUsers,
  deleteUser,
  toggleAdmin,
  updateUser,
} from "../admin/Api/userApi";
import type { UserDto, UpdateUserDto } from "../types/User";

export function useAdminUsers() {
  const [users, setUsers] = useState<UserDto[]>([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetchUsers();
      setUsers(res);
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id: number) => {
    await deleteUser(id);
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  const toggleAdminRole = async (id: number) => {
    const res = await toggleAdmin(id);
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, isAdmin: res.isAdmin } : u))
    );
  };

  const update = async (id: number, data: UpdateUserDto) => {
    await updateUser(id, data);
    await load();
  };

  useEffect(() => {
    load();
  }, []);

  return { users, loading, remove, toggleAdminRole, update };
}
