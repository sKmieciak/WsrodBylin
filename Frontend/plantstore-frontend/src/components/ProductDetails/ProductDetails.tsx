import ProductImage from "./ProductImage";
import ProductInfo from "./ProductInfo";
import ProductTabs from "./ProductTabs";
import type { ReviewResponseDto } from "../../types/Review";

export interface ProductDetailsProps {
  name: string;
  price: number;
  stock: number;
  imageUrl: string;
  description: string;
  reviews: ReviewResponseDto[];
  productId: number;
  onReviewAdded: () => void;
  shortDescription?: string;
}

export default function ProductDetails({
  name,
  price,
  stock,
  imageUrl,
  description,
  reviews,
  shortDescription,
  productId,
  onReviewAdded
}: ProductDetailsProps) {
  return (
    <div className="max-w-screen-xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-6 rounded-2xl shadow-lg border">
        <ProductImage imageUrl={imageUrl} name={name} />
        <ProductInfo
        productId={productId}
          name={name}
          price={price}
          stock={stock}
          shortDescription={shortDescription}
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
