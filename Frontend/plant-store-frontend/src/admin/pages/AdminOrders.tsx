import { useEffect, useState } from "react";
import { getAdminOrders, updateOrderStatus, updatePaymentStatus, deleteOrder } from "../../api/orderApi";
import type { OrderAdminDto } from "../../types/Order";
import { OrderStatusLabels, PaymentStatusLabels } from "../../types/Order";
import { Trash2 } from "lucide-react";

export default function AdminOrders() {
  const [orders, setOrders] = useState<OrderAdminDto[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<number | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const data = await getAdminOrders();
      setOrders(data.data ?? []);
      setTotal(data.total ?? 0);
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleStatus = async (id: number, status: number) => {
    await updateOrderStatus(id, status);
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
  };

  const handlePayment = async (id: number, paymentStatus: number) => {
    await updatePaymentStatus(id, paymentStatus);
    setOrders(prev => prev.map(o => o.id === id ? { ...o, paymentStatus } : o));
  };

  const handleDelete = async (id: number) => {
    if (!confirm(`Na pewno usunąć zamówienie #${id}? Stan magazynu zostanie przywrócony.`)) return;
    await deleteOrder(id);
    setOrders(prev => prev.filter(o => o.id !== id));
    setTotal(prev => prev - 1);
  };

  const totalValue = (order: OrderAdminDto) =>
    (order.items ?? []).reduce((s, i) => s + i.priceAtPurchase * i.quantity, 0) + (order.deliveryCost ?? 0);

  if (loading) return <div className="p-6">Ładowanie...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Zamówienia ({total})</h1>
      {orders.length === 0 && <p className="text-gray-500">Brak zamówień.</p>}
      <div className="flex flex-col gap-4">
        {orders.map(order => (
          <div key={order.id} className="border rounded-lg bg-white shadow-sm overflow-hidden">
            {/* Header */}
            <div
              className="flex flex-wrap items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50"
              onClick={() => setExpanded(expanded === order.id ? null : order.id)}
            >
              <div className="flex items-center gap-4">
                <span className="font-semibold text-gray-800">#{order.id}</span>
                <span className="text-sm text-gray-600">{new Date(order.createdAt).toLocaleDateString("pl-PL")}</span>
                <span className="font-medium">{order.userFullName}</span>
                <span className="text-sm text-gray-500">{order.userEmail}</span>
                {order.userPhone && <span className="text-sm text-gray-500">{order.userPhone}</span>}
              </div>
              <div className="flex items-center gap-3 mt-2 sm:mt-0">
                <span className="text-sm font-semibold">{totalValue(order).toFixed(2)} zł</span>
                {/* Status zamówienia */}
                <select
                  value={order.status}
                  onClick={e => e.stopPropagation()}
                  onChange={e => handleStatus(order.id, Number(e.target.value))}
                  className="text-xs border rounded px-2 py-1 bg-white"
                >
                  {Object.entries(OrderStatusLabels).map(([k, v]) => (
                    <option key={k} value={k}>{v}</option>
                  ))}
                </select>
                {/* Status płatności */}
                <button
                  onClick={e => { e.stopPropagation(); handlePayment(order.id, order.paymentStatus === 1 ? 0 : 1); }}
                  className={`text-xs px-3 py-1 rounded font-medium transition ${
                    order.paymentStatus === 1
                      ? "bg-green-100 text-green-700 hover:bg-green-200"
                      : "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                  }`}
                >
                  {PaymentStatusLabels[order.paymentStatus]}
                </button>
                {/* Usuń */}
                <button
                  onClick={e => { e.stopPropagation(); handleDelete(order.id); }}
                  title="Usuń zamówienie (przywróci stan magazynu)"
                  className="p-1.5 rounded text-red-400 hover:bg-red-50 hover:text-red-600 transition"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            {/* Szczegóły */}
            {expanded === order.id && (
              <div className="border-t px-4 py-3 bg-gray-50 text-sm">
                <div className="grid sm:grid-cols-2 gap-4 mb-3">
                  <div>
                    <p className="text-gray-500 mb-1">Adres dostawy</p>
                    <p>{order.address ?? "—"}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Dostawa</p>
                    <p>{order.courier} — {order.deliveryCost.toFixed(2)} zł</p>
                    {order.paczkomatPoint && (
                      <p className="text-xs text-green-700 mt-1 font-medium">Paczkomat: {order.paczkomatPoint}</p>
                    )}
                    <p className="text-gray-500 mt-2 mb-1">Płatność</p>
                    <p>{order.paymentMethod}</p>
                  </div>
                </div>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-gray-500 text-left border-b">
                      <th className="pb-1">Produkt</th>
                      <th className="pb-1 text-right">Ilość</th>
                      <th className="pb-1 text-right">Cena</th>
                      <th className="pb-1 text-right">Suma</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(order.items ?? []).map((item, i) => (
                      <tr key={i} className="border-b last:border-0">
                        <td className="py-1">{item.productName}</td>
                        <td className="py-1 text-right">{item.quantity}</td>
                        <td className="py-1 text-right">{item.priceAtPurchase.toFixed(2)} zł</td>
                        <td className="py-1 text-right">{(item.priceAtPurchase * item.quantity).toFixed(2)} zł</td>
                      </tr>
                    ))}
                    <tr className="font-semibold">
                      <td colSpan={3} className="pt-2 text-right">Razem z dostawą:</td>
                      <td className="pt-2 text-right">{totalValue(order).toFixed(2)} zł</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
