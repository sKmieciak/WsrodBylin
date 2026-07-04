import { useState } from "react";
import type { UserDto, UpdateUserDto } from "../../../types/User";
import UserTable from "./UserTable";
import EditUserModal from "./EditUserModal";
import { useAdminUsers } from "../../../hooks/useAdminUsers";

export default function AdminUsers() {
  const { users, loading, remove, toggleAdminRole, update } = useAdminUsers();
  const [editingUser, setEditingUser] = useState<UserDto | null>(null);
  const [form, setForm] = useState<UpdateUserDto | null>(null);

  const handleDelete = async (id: number) => {
    if (!confirm("Na pewno chcesz usunąć tego użytkownika?")) return;
    await remove(id);
  };

  const openEditModal = (user: UserDto) => {
    setEditingUser(user);
    setForm({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneNumber: user.phone ?? "",
      isCompanyAccount: user.isCompanyAccount,
      street: user.street ?? "",
      houseNumber: user.houseNumber ?? "",
      postalCode: user.postalCode ?? "",
      city: user.city ?? "",
      country: user.country ?? "",
      addressAddon: user.addressAddon ?? "",
    });
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (!form) return;
    const target = e.target as HTMLInputElement;
    const { name, value, type } = target;
    const finalValue = type === "checkbox" ? target.checked : value;
    setForm({ ...form, [name]: finalValue });
  };

  const handleSave = async () => {
    if (!editingUser || !form) return;
    await update(editingUser.id, form);
    setEditingUser(null);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Zarządzanie użytkownikami</h1>
      <UserTable
        users={users}
        loading={loading}
        onEdit={openEditModal}
        onDelete={handleDelete}
        onToggleAdmin={toggleAdminRole}
      />
      {editingUser && form && (
        <EditUserModal
          form={form}
          onChange={handleFormChange}
          onCancel={() => setEditingUser(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
