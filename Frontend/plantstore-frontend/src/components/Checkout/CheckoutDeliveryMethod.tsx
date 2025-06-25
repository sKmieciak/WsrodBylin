import type { DeliveryOption } from "../../types/DeliveryOption";

interface Props {
  deliveryOptions: DeliveryOption[];
  selectedDelivery: DeliveryOption;
  setSelectedDelivery: (option: DeliveryOption) => void;
}

export default function CheckoutDeliveryMethod({
  deliveryOptions,
  selectedDelivery,
  setSelectedDelivery,
}: Props) {
  return (
    <div className="bg-white border rounded-xl shadow p-6">
      <h2 className="text-lg font-semibold mb-4">Metoda dostawy</h2>
      <div className="space-y-3">
        {deliveryOptions.map((opt) => (
          <label
            key={opt.label}
            className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer ${
              selectedDelivery.label === opt.label
                ? "border-green-500 bg-green-50"
                : "border-gray-300 hover:bg-gray-50"
            }`}
          >
            <div>
              <div className="font-medium">{opt.label}</div>
              {opt.note && (
                <div className="text-xs text-gray-500 mt-1">{opt.note}</div>
              )}
            </div>
            <div className="text-right text-sm font-semibold">
              {opt.price.toFixed(2)} PLN
            </div>
            <input
              type="radio"
              checked={selectedDelivery.label === opt.label}
              onChange={() => setSelectedDelivery(opt)}
              className="accent-green-600 ml-4"
            />
          </label>
        ))}
        {selectedDelivery.label.includes("Paczkomaty") && (
          <button className="mt-3 text-sm px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600">
            Wyszukaj
          </button>
        )}
      </div>
    </div>
  );
}
