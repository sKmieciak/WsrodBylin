import ProductImage from "./ProductImage";
import ProductInfo from "./ProductInfo";
import ProductTabs from "./ProductTabs";
import type { PromotionDto } from "../../types/PromotionDto";
import type { ProductDetailsDto } from "../../types/ProductDetailsDto";

interface Props extends ProductDetailsDto {
  promotion: PromotionDto | null;
  onReviewAdded: () => void;
}

export default function ProductDetails({
  name,
  price,
  stock,
  imageUrls,
  defaultImageUrl,
  description,
  reviews,
  shortDescription,
  productId,
  promotion,
  onReviewAdded,
}: Props) {
  const hasPromo = promotion !== null;
  const discount = promotion?.discountPercentage ?? 0;
  const finalPrice = hasPromo ? price * (1 - discount / 100) : price;

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-6 rounded-2xl shadow-lg border">
        <ProductImage
          imageUrls={imageUrls}
          name={name}
          defaultImageUrl={defaultImageUrl}
        />
        <ProductInfo
          productId={productId}
          name={name}
          price={finalPrice}
          originalPrice={price}
          discountPercentage={discount}
          stock={stock}
          shortDescription={shortDescription}
          image={
            (imageUrls?.length ?? 0) > 0
              ? imageUrls[0]
              : defaultImageUrl || "/images/placeholder.jpg"
          }
        />
      </div>

      <ProductTabs
        description={description}
        reviews={reviews}
        productId={productId}
        onReviewAdded={onReviewAdded}
      />
    </div>
  );
}
