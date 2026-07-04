import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center px-4">
      <div className="text-7xl mb-6">🌿</div>
      <h1 className="text-4xl font-bold text-gray-800 mb-3">404</h1>
      <p className="text-gray-500 text-lg mb-8">Tej strony nie ma w naszym ogródku.</p>
      <Link
        to="/"
        className="px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition"
      >
        Wróć do sklepu
      </Link>
    </div>
  );
}
