import { UserCheck } from "lucide-react";

interface Props {
  name: string;
  onClick: () => void;
}

export default function UserButton({ name, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className="flex items-center space-x-2 px-2 py-2 hover:bg-green-50 rounded-full transition"
    >
      <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center flex-shrink-0">
        <UserCheck className="w-4 h-4 text-white" />
      </div>
      <span className="text-sm text-gray-700 hidden sm:inline max-w-[120px] truncate">👋 {name}</span>
    </button>
  );
}
