import axios from "../../lib/axios";
import { API_URL } from "../../data/Api_URL";
import type { UserDto, UpdateUserDto } from "../../types/User";

// 📥 Pobierz wszystkich użytkowników (admin)
export const fetchUsers = async (): Promise<UserDto[]> => {
  const response = await axios.get(`${API_URL}api/admin/users`);
  return response.data;
};

// 🔄 Zaktualizuj dane użytkownika (admin)
export const updateUser = async (id: number, data: UpdateUserDto) => {
  await axios.put(`${API_URL}api/admin/users/${id}`, data);
};

// 🛡️ Nadaj/odbierz rolę admina
export const toggleAdmin = async (id: number): Promise<{ isAdmin: boolean }> => {
  const response = await axios.put(`${API_URL}api/admin/users/${id}/admin`);
  return response.data;
};

// 🗑️ Usuń użytkownika (admin)
export const deleteUser = async (id: number) => {
  await axios.delete(`${API_URL}api/admin/users/${id}`);
};
