import React from "react";
import type { Order } from "../../types/Order";
import { Clock, PackageCheck, Copy } from "lucide-react";
import type { Settings } from "../../api/settingsApi";

interface Props {
  order: Order;
  settings?: Settings;
}

const OrderCard: React.FC<Props> = ({ order, settings }) => {
  const statusLabels: Record<number, string> = {
    0: "Oczekuje", 1: "Potwierdzone", 2: "Wysłane", 3: "Dostarczone",
  };
  const getStatusStyle = (status: number): string => {
    switch (status) {
      case 1: return "bg-blue-100 text-blue-800";
      case 2: return "bg-yellow-100 text-yellow-800";
      case 3: return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const total = order.items.reduce(
    (sum, item) => sum + item.quantity * item.priceAtPurchase,
    0
  );

  const isBlik = order.paymentMethod.toLowerCase().includes("telefon") || order.paymentMethod.toLowerCase().includes("blik");
  const isTraditional = order.paymentMethod.toLowerCase().includes("przelew") && !isBlik;
  const isPaid = order.paymentStatus === 1;
  const bankTitle = (settings?.bankTransferTitle ?? "Zamówienie #{id}").replace("{id}", String(order.id));
  const blikTitle = (settings?.blikTransferTitle ?? "Zamówienie #{id}").replace("{id}", String(order.id));
  const copyToClipboard = (text: string) => navigator.clipboard.writeText(text);

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow p-6 space-y-4">
      {/* Nagłówek */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold flex items-center gap-2 text-gray-800">
          <PackageCheck className="w-5 h-5 text-green-600" />
          Zamówienie #{order.id}
        </h2>
        <span
          className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusStyle(order.status)}`}
        >
          {statusLabels[order.status] ?? "Nieznany"}
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
              src={item.productImage || "/images/placeholder.svg"}
              alt={item.productName}
              onError={(e) => { e.currentTarget.src = "/images/placeholder.svg"; }}
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

      {/* Dane do przelewu tradycyjnego */}
      {isTraditional && !isPaid && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 space-y-2">
          <p className="text-sm font-semibold text-amber-800">Oczekuje na płatność — dane do przelewu:</p>
          {settings?.bankAccountNumber ? (
            [
              { label: "Odbiorca", value: settings.bankRecipient },
              { label: "Numer konta", value: settings.bankAccountNumber },
              { label: "Nazwa banku", value: settings.bankName },
              { label: "Tytuł przelewu", value: bankTitle },
            ].map(({ label, value }) =>
              value ? (
                <div key={label} className="flex items-center justify-between gap-2">
                  <div>
                    <div className="text-xs text-gray-500">{label}</div>
                    <div className="text-sm font-medium text-gray-800">{value}</div>
                  </div>
                  <button onClick={() => copyToClipboard(value)} title="Kopiuj" className="p-1.5 rounded hover:bg-amber-100 text-amber-700 flex-shrink-0">
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              ) : null
            )
          ) : (
            <p className="text-xs text-gray-500">Skontaktuj się ze sprzedawcą w celu uzyskania danych do przelewu.</p>
          )}
        </div>
      )}

      {/* Dane do przelewu BLIK */}
      {isBlik && !isPaid && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
          <p className="text-sm font-semibold text-blue-800">Oczekuje na płatność — przelew na telefon (BLIK):</p>
          {settings?.blikPhoneNumber ? (
            [
              { label: "Numer telefonu", value: settings.blikPhoneNumber },
              { label: "Kwota", value: `${(total + order.deliveryCost).toFixed(2)} zł` },
              { label: "Tytuł przelewu", value: blikTitle },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between gap-2">
                <div>
                  <div className="text-xs text-gray-500">{label}</div>
                  <div className="text-sm font-medium text-gray-800">{value}</div>
                </div>
                <button onClick={() => copyToClipboard(value)} title="Kopiuj" className="p-1.5 rounded hover:bg-blue-100 text-blue-700 flex-shrink-0">
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            ))
          ) : (
            <p className="text-xs text-gray-500">Skontaktuj się ze sprzedawcą w celu uzyskania numeru telefonu do BLIK.</p>
          )}
        </div>
      )}

      {/* Suma */}
      <div className="text-right text-green-700 text-lg font-bold">
        Suma: {total.toFixed(2)} zł
      </div>
    </div>
  );
};

export default OrderCard;
