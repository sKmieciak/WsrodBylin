import type { PaymentOption } from "../../types/PaymentOption";

interface Props {
  paymentOptions: PaymentOption[];
  selectedPayment: PaymentOption;
  setSelectedPayment: (option: PaymentOption) => void;
}

export default function CheckoutPaymentMethod({
  paymentOptions,
  selectedPayment,
  setSelectedPayment,
}: Props) {
  return (
    <div className="bg-white border rounded-xl shadow p-6">
      <h2 className="text-lg font-semibold mb-4">Metoda płatności</h2>
      <div className="space-y-3">
        {paymentOptions.map((opt) => (
          <label
            key={opt.label}
            className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer ${
              selectedPayment.label === opt.label
                ? "border-green-500 bg-green-50"
                : "border-gray-300 hover:bg-gray-50"
            }`}
          >
            <div className="font-medium">{opt.label}</div>
            <input
              type="radio"
              checked={selectedPayment.label === opt.label}
              onChange={() => setSelectedPayment(opt)}
              className="accent-green-600"
            />
          </label>
        ))}
      </div>
    </div>
  );
}
