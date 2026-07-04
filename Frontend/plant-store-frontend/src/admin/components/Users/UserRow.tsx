import type { UserDto } from "../../../types/User";
import { Pencil, Shield, ShieldCheck, Trash } from "lucide-react";

interface Props {
  user: UserDto;
  onEdit: (user: UserDto) => void;
  onDelete: (id: number) => void;
  onToggleAdmin: (id: number) => void;
}

export default function UserRow({ user, onEdit, onDelete, onToggleAdmin }: Props) {
  return (
    <tr className="border-t text-sm hover:bg-gray-50">
      <td className="px-4 py-2">{user.email}</td>
      <td className="px-4 py-2">
        {user.firstName} {user.lastName}
      </td>
      <td className="px-4 py-2">{user.phone ?? "-"}</td>
      <td className="px-4 py-2">
        {[user.street, user.houseNumber, user.city].filter(Boolean).join(" ") || "-"}
      </td>
      <td className="px-4 py-2 text-center">
        <button
          onClick={() => onToggleAdmin(user.id)}
          className="text-indigo-600 hover:text-indigo-800 transition"
        >
          {user.isAdmin ? (
            <ShieldCheck className="inline w-5 h-5" />
          ) : (
            <Shield className="inline w-5 h-5" />
          )}
        </button>
      </td>
      <td className="px-4 py-2 text-center space-x-2">
        <button onClick={() => onEdit(user)} className="text-blue-500 hover:text-blue-700">
          <Pencil className="inline w-4 h-4" />
        </button>
        <button onClick={() => onDelete(user.id)} className="text-red-500 hover:text-red-700">
          <Trash className="inline w-4 h-4" />
        </button>
      </td>
    </tr>
  );
}
