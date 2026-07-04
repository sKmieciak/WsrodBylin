import { useEffect, useState } from "react";
import { useOrders } from "../../hooks/useOrder";
import OrderCard from "../Orders/OrderCard";
import { Loader } from "lucide-react";
import { getSettings, type Settings } from "../../api/settingsApi";

export default function OrdersList() {
  const { orders, loading, error } = useOrders();
  const [settings, setSettings] = useState<Settings>({});

  useEffect(() => { getSettings().then(setSettings); }, []);

  if (loading) return (
    <div className="flex justify-center py-10 text-gray-500">
      <Loader className="animate-spin w-5 h-5 mr-2" /> Ładowanie...
    </div>
  );

  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Historia zamówień</h2>
      {orders.length === 0 ? (
        <p className="text-gray-500">Nie masz jeszcze żadnych zamówień.</p>
      ) : (
        <div className="space-y-6">
          {orders.map(order => (
            <OrderCard key={order.id} order={order} settings={settings} />
          ))}
        </div>
      )}
    </div>
  );
}
