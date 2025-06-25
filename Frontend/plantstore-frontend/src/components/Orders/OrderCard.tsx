import React from "react";
import type { Order } from "../../types/Order";
import { Clock, PackageCheck } from "lucide-react";

interface Props {
  order: Order;
}

const OrderCard: React.FC<Props> = ({ order }) => {
  const getStatusStyle = (status: string): string => {
    switch (status) {
      case "Nowe":
        return "bg-blue-100 text-blue-800";
      case "W trakcie":
        return "bg-yellow-100 text-yellow-800";
      case "Zrealizowane":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const total = order.items.reduce(
    (sum, item) => sum + item.quantity * item.priceAtPurchase,
    0
  );

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow p-6 space-y-4">
      {/* Nagłówek */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold flex items-center gap-2 text-gray-800">
          <PackageCheck className="w-5 h-5 text-green-600" />
          Zamówienie #{order.id}
        </h2>
        <span
          className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusStyle(
            order.status
          )}`}
        >
          {order.status}
        </span>
      </div>

      {/* Data */}
      <div className="flex items-center text-sm text-gray-500 gap-2">
        <Clock className="w-4 h-4" />
        {new Date(order.createdAt).toLocaleString("pl-PL")}
      </div>

      {/* Lista produktów */}
      <div className="space-y-4">
        {order.items.map((item) => (
          <div key={item.productId} className="flex items-center gap-4">
            <img
              src={item.productImage}
              alt={item.productName}
              className="w-16 h-16 object-cover rounded border"
            />
            <div className="flex-1">
              <div className="font-medium text-gray-800">{item.productName}</div>
              <div className="text-sm text-gray-600">
                Ilość: {item.quantity} × {item.priceAtPurchase.toFixed(2)} zł
              </div>
            </div>
            <div className="text-sm font-semibold text-gray-700">
              {(item.quantity * item.priceAtPurchase).toFixed(2)} zł
            </div>
          </div>
        ))}
      </div>

      {/* Suma */}
      <div className="text-right text-green-700 text-lg font-bold">
        Suma: {total.toFixed(2)} zł
      </div>
    </div>
  );
};

export default OrderCard;
