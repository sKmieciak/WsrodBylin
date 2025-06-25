interface Props {
  handlePlaceOrder: () => void;
  navigate: (path: string) => void;
}

export default function CheckoutSummaryActions({
  handlePlaceOrder,
  navigate,
}: Props) {
  return (
    <div className="flex justify-between items-center">
      <button
        onClick={() => navigate("/")}
        className="text-gray-600 underline hover:text-black"
      >
        Wróć do zakupów
      </button>
      <button
        onClick={handlePlaceOrder}
        className="bg-teal-500 hover:bg-teal-600 text-white px-10 py-3 rounded-xl font-semibold text-lg"
      >
        Dalej
      </button>
    </div>
  );
}
