import type { Product } from "../../types/Product";
import type { ProductDetailsProps } from "../../components/ProductDetails/ProductDetails";
import type { ReviewResponseDto } from "../../types/Review";

export function mapProductToDetailsProps(
  product: Product,
  reviews: ReviewResponseDto[]
): Omit<ProductDetailsProps, "productId" | "onReviewAdded"> {
  return {
    name: product.name,
    price: product.price,
    stock: product.inStock,
    imageUrl: product.imageUrl,
    description: product.description,
    reviews,
    shortDescription: product.description.slice(0, 120) + "...",
  };
}
