import { useState } from "react";
import { useCart } from "../../hooks/useCart";

interface ProductInfoProps {
  productId: number;
  name: string;
  price: number;
  originalPrice?: number;
  discountPercentage?: number;
  stock: number;
  shortDescription?: string;
  image: string;
}

export default function ProductInfo({
  productId,
  name,
  price,
  originalPrice,
  discountPercentage,
  stock,
  shortDescription,
  image,
}: ProductInfoProps) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [cartError, setCartError] = useState<string | null>(null);
  const { addToCart, totalQuantity } = useCart();
  const remaining = Math.max(0, 16 - totalQuantity);
  const maxQty = Math.min(remaining, stock);

  const safeImage = image || "/images/placeholder.png";

  const handleAddToCart = async () => {
    setCartError(null);
    try {
      await addToCart(
        {
          id: productId,
          name,
          image: safeImage,
          price,
          inStock: stock,
        },
        quantity
      );
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch {
      setCartError("Nie udało się dodać do koszyka.");
    }
  };

  return (
    <div className="flex flex-col justify-between space-y-6">
      <div>
        <h1 className="text-3xl font-semibold mb-2">{name}</h1>

        {/* Cena z obsługą promocji */}
        {originalPrice && originalPrice !== price ? (
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-green-600">
              {price.toFixed(2)} zł
            </span>
            <span className="line-through text-gray-500 text-sm">
              {originalPrice.toFixed(2)} zł
            </span>
            {discountPercentage && (
              <span className="text-sm text-red-500 font-medium">
                -{discountPercentage}%
              </span>
            )}
          </div>
        ) : (
          <p className="text-2xl text-green-700 font-bold mb-2">
            {price.toFixed(2)} zł
          </p>
        )}

        {/* Dostępność */}
        <p className={`text-sm ${stock > 0 ? (stock <= 3 ? "text-orange-600" : "text-green-600") : "text-red-500"}`}>
          {stock > 0
            ? stock <= 3
              ? `Ostatnie ${stock} szt.`
              : `Dostępne: ${stock} szt.`
            : "Niedostępny"}
        </p>

        {/* Opis */}
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
            max={maxQty}
            value={quantity}
            onChange={(e) => setQuantity(Math.min(maxQty, Math.max(1, parseInt(e.target.value) || 1)))}
            className="w-20 border rounded px-2 py-1"
          />
        </div>
      </div>

      {remaining === 0 && <p className="text-orange-600 text-sm">Koszyk pełny — max. 16 szt. łącznie.</p>}
      {cartError && <p className="text-red-600 text-sm">{cartError}</p>}
      <button
        onClick={handleAddToCart}
        className={`font-semibold py-2 px-4 rounded-xl w-full transition duration-200 text-white ${
          added
            ? "bg-green-700"
            : "bg-green-600 hover:bg-green-700"
        }`}
        disabled={stock === 0 || quantity < 1 || remaining === 0}
      >
        {added ? "Dodano do koszyka!" : "Dodaj do koszyka"}
      </button>
    </div>
  );
}
