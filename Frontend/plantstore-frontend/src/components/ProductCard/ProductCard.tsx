import { Link } from "react-router-dom";
import type { Product } from "../../types/Product";
import { API_URL } from "../../data/Api_URL";

interface Props {
  product: Product;
}
export const getImageUrl = (path: string) => `${API_URL}${path}`;

export const ProductCard = ({ product }: Props) => {
  const isInStock = product.inStock > 0;

  return (
    <Link
      to={`/product/${product.id}`}
      className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden transition-all duration-300 ease-in-out hover:shadow-lg hover:scale-[1.02] flex flex-col items-center justify-between p-4 relative group h-full max-w-[300px]"
    >
      {/* Obrazek */}
      <div className="w-full h-60 overflow-hidden rounded-lg">
        <img
        src={getImageUrl(product.imageUrl)}
          alt={product.name}
          className="w-full h-full object-cover rounded-lg transition-transform duration-300 ease-in-out group-hover:scale-105"
        />
      </div>

      {/* Cena i nazwa */}
      <div className="text-center mt-4">
        <p className="text-lg font-semibold text-green-700">
          {product.price.toFixed(2)} zł
        </p>
        <h3 className="text-sm font-medium text-gray-800 mt-1">
          {product.name}
        </h3>
      </div>

      {/* Detale widoczne tylko po hoverze */}
      <div className="text-center mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out">
        <p className="text-sm text-gray-500 mb-2">{product.description}</p>
        <p className={`text-sm mb-4 ${isInStock ? "text-green-600" : "text-red-500"} font-medium`}>
          {isInStock ? "• Dostępny" : "Brak w magazynie"}
        </p>

        <button
          disabled={!isInStock}
          onClick={(e) => e.preventDefault()} // zapobiega przeładowaniu linku
          className={`w-full px-4 py-2 rounded-md font-semibold transition duration-300 ${
            isInStock
              ? "bg-emerald-500 text-white hover:bg-emerald-600"
              : "bg-gray-300 text-white cursor-not-allowed"
          }`}
        >
          Dodaj do koszyka
        </button>
      </div>
    </Link>
  );
};
