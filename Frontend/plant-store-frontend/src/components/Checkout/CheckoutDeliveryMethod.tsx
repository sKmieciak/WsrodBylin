import { useState } from "react";
import { MapPin } from "lucide-react";
import type { DeliveryOption } from "../../types/DeliveryOption";
import PaczkomatMapModal from "./PaczkomatMapModal";

interface Props {
  deliveryOptions: DeliveryOption[];
  selectedDelivery: DeliveryOption;
  setSelectedDelivery: (option: DeliveryOption) => void;
  paczkomatPoint: string;
  onPaczkomatPointChange: (point: string, name: string) => void;
}

export default function CheckoutDeliveryMethod({
  deliveryOptions,
  selectedDelivery,
  setSelectedDelivery,
  paczkomatPoint,
  onPaczkomatPointChange,
}: Props) {
  const [showMap, setShowMap] = useState(false);
  const isPaczkomat = selectedDelivery.label === "Paczkomaty InPost";

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
      </div>

      {isPaczkomat && (
        <div className="mt-4 space-y-2">
          <button
            type="button"
            onClick={() => setShowMap(true)}
            className="flex items-center gap-2 w-full justify-center border-2 border-green-500 text-green-700 font-medium rounded-lg px-4 py-2.5 hover:bg-green-50 transition-colors"
          >
            <MapPin className="w-4 h-4" />
            {paczkomatPoint ? "Zmień paczkomat" : "Wybierz paczkomat na mapie"}
          </button>
          {paczkomatPoint && (
            <p className="text-sm text-green-700 font-medium text-center">
              Wybrany: <span className="font-bold">{paczkomatPoint}</span>
            </p>
          )}
          {!paczkomatPoint && (
            <p className="text-xs text-red-500 text-center">Wybierz paczkomat, aby kontynuować</p>
          )}
          {showMap && (
            <PaczkomatMapModal
              onSelect={(p) => {
                onPaczkomatPointChange(p.name, p.name);
                setShowMap(false);
              }}
              onClose={() => setShowMap(false)}
            />
          )}
        </div>
      )}
    </div>
  );
}
