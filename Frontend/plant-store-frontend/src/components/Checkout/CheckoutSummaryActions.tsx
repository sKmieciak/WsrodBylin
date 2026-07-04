interface Props {
  handlePlaceOrder: () => void;
  navigate: (path: string) => void;
  loading?: boolean;
}

export default function CheckoutSummaryActions({
  handlePlaceOrder,
  navigate,
  loading = false,
}: Props) {
  return (
    <div className="flex justify-between items-center">
      <button
        onClick={() => navigate("/")}
        className="text-gray-600 underline hover:text-black"
        disabled={loading}
      >
        Wróć do zakupów
      </button>
      <button
        onClick={handlePlaceOrder}
        disabled={loading}
        className="bg-teal-500 hover:bg-teal-600 text-white px-10 py-3 rounded-xl font-semibold text-lg disabled:opacity-60"
      >
        {loading ? "Składanie zamówienia..." : "Dalej"}
      </button>
    </div>
  );
}
