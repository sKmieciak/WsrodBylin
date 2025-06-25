import { useNavigate } from "react-router-dom";

interface CartDrawerFooterProps {
  total: number;
  onClose: () => void;
}

export default function CartDrawerFooter({ total, onClose }: CartDrawerFooterProps) {
  const navigate = useNavigate();

  return (
    <div className="p-4 border-t absolute bottom-0 w-full bg-white">
      <div className="flex justify-between mb-4 text-base font-medium">
        <span>Suma:</span>
        <span className="text-green-600 font-semibold">
          {total.toFixed(2)} zł
        </span>
      </div>
      <button
        onClick={() => {
          onClose();
          navigate("/cart");
        }}
        className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-xl transition"
      >
        Przejdź do koszyka
      </button>
    </div>
  );
}
