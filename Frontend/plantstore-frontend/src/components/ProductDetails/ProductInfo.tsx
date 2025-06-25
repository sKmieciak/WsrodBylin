import { useState } from "react";
import { useCart } from "../../hooks/useCart";
interface ProductInfoProps {
  productId: number;
  name: string;
  price: number;
  stock: number;
  shortDescription?: string;
}

export default function ProductInfo({
  productId,
  name,
  price,
  stock,
  shortDescription,
}: ProductInfoProps) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  const handleAddToCart = async () => {
    try {
      await addToCart(productId, quantity);
      // możesz tu dodać np. toast albo komunikat „Dodano do koszyka”
    } catch (err) {
      console.error("Błąd dodawania do koszyka", err);
    }
  };

  return (
    <div className="flex flex-col justify-between space-y-6">
      <div>
        <h1 className="text-3xl font-semibold mb-2">{name}</h1>
        <p className="text-2xl text-green-700 font-bold mb-2">
          {price.toFixed(2)} zł
        </p>
        <p className={`text-sm ${stock > 0 ? "text-green-600" : "text-red-500"}`}>
          {stock > 0 ? "Dostępny" : "Niedostępny"}
        </p>

        {shortDescription && (
          <p className="text-gray-700 mt-4">{shortDescription}</p>
        )}

        {/* Ilość */}
        <div className="mt-4 flex items-center space-x-2">
          <label htmlFor="quantity" className="text-sm font-medium">
            Ilość:
          </label>
          <input
            id="quantity"
            type="number"
            min={1}
            max={stock}
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value))}
            className="w-20 border rounded px-2 py-1"
          />
        </div>
      </div>

      <button
        onClick={handleAddToCart}
        className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-xl w-full transition duration-200"
        disabled={stock === 0 || quantity < 1}
      >
        Dodaj do koszyka
      </button>
    </div>
  );
}
