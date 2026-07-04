import { useState } from "react";
import { Link } from "react-router-dom";
import type { Product } from "../../types/Product";
import type { PromotionDto } from "../../types/PromotionDto";
import { API_URL } from "../../data/Api_URL";
import { useCart } from "../../hooks/useCart";
import { ShoppingCart } from "lucide-react";

interface Props {
  product: Product;
  promotions?: PromotionDto[];
}

export const getImageUrl = (path: string) => `${API_URL}${path}`;

export const ProductCard = ({ product, promotions = [] }: Props) => {
  const isInStock = product.inStock > 0;
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const promo = promotions.find((p) => p.productIds.includes(product.id));
  const discount = promo?.discountPercentage ?? 0;
  const discountedPrice = product.price * (1 - discount / 100);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isInStock) return;
    addToCart(
      { id: product.id, name: product.name, image: product.defaultImageUrl ?? "", price: product.price, inStock: product.inStock },
      1
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <Link
      to={`/product/${product.id}`}
      className="bg-card border border-border rounded-xl shadow-sm overflow-hidden transition-all duration-300 ease-in-out hover:shadow-md hover:scale-[1.01] flex flex-col p-3 group h-full"
    >
      {/* Obrazek z badge'em promocji */}
      <div className="w-full h-40 sm:h-48 overflow-hidden rounded-lg relative">
        <img
          src={getImageUrl(product.defaultImageUrl || "/images/placeholder.svg")}
          alt={product.name}
          loading="lazy"
          decoding="async"
          onError={(e) => { e.currentTarget.src = "/images/placeholder.svg"; }}
          className="w-full h-full object-cover rounded-lg transition-transform duration-300 ease-in-out group-hover:scale-105"
        />
        {discount > 0 && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded shadow-sm">
            -{discount}%
          </span>
        )}
      </div>

      {/* Cena i nazwa */}
      <div className="text-center mt-3 flex-1">
        {discount > 0 ? (
          <div className="flex justify-center items-baseline gap-2">
            <span className="text-gray-400 line-through text-sm">
              {product.price.toFixed(2)} zł
            </span>
            <span className="text-green-600 font-bold text-lg">
              {discountedPrice.toFixed(2)} zł
            </span>
          </div>
        ) : (
          <p className="text-sm sm:text-base font-semibold text-green-600 dark:text-green-400">
            {product.price.toFixed(2)} zł
          </p>
        )}
        <h3 className="text-sm font-medium text-foreground mt-1">{product.name}</h3>
        <p className="text-xs sm:text-sm text-muted mt-1 line-clamp-2">{product.description}</p>
        {isInStock && (
          <p className={`text-xs mt-1 font-medium ${product.inStock <= 3 ? "text-orange-600" : "text-gray-500"}`}>
            {product.inStock <= 3
              ? `Ostatnie ${product.inStock} szt.`
              : `Dostępne: ${product.inStock} szt.`}
          </p>
        )}
      </div>

      {/* Przycisk Dodaj do koszyka */}
      <div className="w-full mt-4">
        <button
          disabled={!isInStock}
          onClick={handleAddToCart}
          className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-md font-semibold transition duration-300 ${
            isInStock
              ? "bg-emerald-500 text-white hover:bg-emerald-600 active:bg-emerald-700"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          <ShoppingCart size={16} />
          {!isInStock ? "Brak w magazynie" : added ? "Dodano!" : "Dodaj do koszyka"}
        </button>
      </div>
    </Link>
  );
};
