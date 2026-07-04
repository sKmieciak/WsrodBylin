// src/admin/pages/AdminDashboard.tsx
export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Witaj w panelu administratora 👋</h1>
      <p className="text-gray-700">
        Wybierz jedną z sekcji z menu po lewej stronie, aby zarządzać sklepem.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        <div className="bg-white border rounded-lg p-6 shadow-sm">
          <h2 className="text-lg font-semibold">🛒 Produkty</h2>
          <p className="text-sm text-gray-600 mt-1">Dodawaj, edytuj i usuwaj produkty.</p>
        </div>
        <div className="bg-white border rounded-lg p-6 shadow-sm">
          <h2 className="text-lg font-semibold">📦 Zamówienia</h2>
          <p className="text-sm text-gray-600 mt-1">Zarządzaj zamówieniami klientów.</p>
        </div>
        <div className="bg-white border rounded-lg p-6 shadow-sm">
          <h2 className="text-lg font-semibold">🏷️ Promocje</h2>
          <p className="text-sm text-gray-600 mt-1">Twórz i kontroluj aktywne promocje.</p>
        </div>
      </div>
    </div>
  );
}
