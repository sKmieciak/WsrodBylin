import { X } from "lucide-react";

interface CartDrawerHeaderProps {
  onClose: () => void;
}

export default function CartDrawerHeader({ onClose }: CartDrawerHeaderProps) {
  return (
    <div className="p-4 border-b flex justify-between items-center">
      <h2 className="text-lg font-bold">Twój koszyk</h2>
      <button onClick={onClose}>
        <X className="w-5 h-5" />
      </button>
    </div>
  );
}
