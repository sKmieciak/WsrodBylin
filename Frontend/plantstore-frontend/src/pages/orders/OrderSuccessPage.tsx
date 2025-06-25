// src/pages/order/OrderSuccessPage.tsx
import { useParams, Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";

export default function OrderSuccessPage() {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="max-w-xl mx-auto px-4 py-20 text-center">
      <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
      <h1 className="text-3xl font-bold mb-4">Zamówienie złożone!</h1>
      <p className="text-gray-600 mb-6">
        Twoje zamówienie <span className="font-semibold">#{id}</span> zostało
        pomyślnie złożone. Dziękujemy za zakupy!
      </p>
      <Link
        to="/"
        className="inline-block px-6 py-3 bg-green-600 text-white rounded-xl text-lg hover:bg-green-700 transition"
      >
        Wróć do sklepu
      </Link>
    </div>
  );
}
