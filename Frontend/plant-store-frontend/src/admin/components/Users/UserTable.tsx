import type { UserDto } from "../../../types/User";
import UserRow from "./UserRow";
import { Loader2 } from "lucide-react";

interface Props {
  users: UserDto[];
  loading: boolean;
  onEdit: (user: UserDto) => void;
  onDelete: (id: number) => void;
  onToggleAdmin: (id: number) => void;
}

export default function UserTable({
  users,
  loading,
  onEdit,
  onDelete,
  onToggleAdmin,
}: Props) {
  if (loading) {
    return (
      <div className="flex items-center space-x-2 text-gray-600">
        <Loader2 className="animate-spin" />
        <span>Ładowanie...</span>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border rounded shadow-sm">
        <thead>
          <tr className="bg-gray-100 text-left text-sm uppercase tracking-wider">
            <th className="px-4 py-2">Email</th>
            <th className="px-4 py-2">Imię i nazwisko</th>
            <th className="px-4 py-2">Telefon</th>
            <th className="px-4 py-2">Adres</th>
            <th className="px-4 py-2 text-center">Rola</th>
            <th className="px-4 py-2 text-center">Akcje</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <UserRow
              key={user.id}
              user={user}
              onEdit={onEdit}
              onDelete={onDelete}
              onToggleAdmin={onToggleAdmin}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
