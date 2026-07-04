import type { Product } from "../../types/Product";
import type { PromotionDto } from "../../types/PromotionDto";
import { API_URL } from "../../data/Api_URL";
import { Link } from "react-router-dom";

interface Props {
  products: Product[];
  promotions: PromotionDto[];
}

const getImageUrl = (path?: string) =>
  path ? (path.startsWith("http") ? path : `${API_URL}${path}`) : "/images/placeholder.svg";

export default function PromotionSlider({ products, promotions }: Props) {
  if (products.length === 0) return null;

  const getDiscountForProduct = (productId: number): number => {
    for (const promo of promotions) {
      if (promo.productIds.includes(productId)) {
        return promo.discountPercentage;
      }
    }
    return 0;
  };

  return (
    <div className="w-full mt-8 overflow-x-auto">
      <div className="flex gap-6 px-4 sm:px-6 md:px-10 pb-4 snap-x snap-mandatory">
        {products.map((product) => {
          const discount = getDiscountForProduct(product.id);
          const discountedPrice = product.price * (1 - discount / 100);

          return (
            <Link
              to={`/product/${product.id}`}
              key={product.id}
              className="min-w-[220px] max-w-[240px] bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 snap-start flex-shrink-0"
            >
              <div className="relative">
                <img
                  src={getImageUrl(product.imageUrls?.[0])}
                  alt={product.name}
                  onError={(e) => { e.currentTarget.src = "/images/placeholder.svg"; }}
                  className="w-full h-40 object-cover rounded-t-lg"
                />
                {discount > 0 && (
                  <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded shadow-sm">
                    -{discount}%
                  </span>
                )}
              </div>
              <div className="p-3 text-center">
                <h3 className="text-base font-semibold mb-1 truncate">{product.name}</h3>
                <div className="flex justify-center gap-2 items-baseline">
                  <span className="text-gray-400 line-through text-sm">
                    {product.price.toFixed(2)} zł
                  </span>
                  <span className="text-green-600 font-bold text-lg">
                    {discountedPrice.toFixed(2)} zł
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
