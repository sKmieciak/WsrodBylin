import { useOrders } from "../../hooks/useOrder";
import OrderCard from "../../components/Orders/OrderCard";
import { Loader, PackageSearch } from "lucide-react";

export default function OrdersPage() {
  const { orders, loading } = useOrders();

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
        <PackageSearch className="w-7 h-7 text-green-600" />
        Twoje zamówienia
      </h1>

      {loading ? (
        <div className="flex justify-center py-20 text-gray-500">
          <Loader className="animate-spin w-6 h-6 mr-2" />
          Ładowanie zamówień...
        </div>
      ) : orders.length === 0 ? (
        <p className="text-gray-600 text-center mt-10">
          Nie masz jeszcze żadnych zamówień.
        </p>
      ) : (
        <div className="space-y-8">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}
