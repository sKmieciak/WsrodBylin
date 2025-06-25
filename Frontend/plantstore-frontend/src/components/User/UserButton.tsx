import { User } from "lucide-react";

interface Props {
  name: string;
  onClick: () => void;
}

export default function UserButton({ name, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className="flex items-center space-x-2 px-3 py-2 hover:bg-green-50 rounded transition"
    >
      <User className="w-6 h-6 text-gray-700" />
      <span className="text-sm text-gray-700 hidden sm:inline">👋 {name}</span>
    </button>
  );
}
