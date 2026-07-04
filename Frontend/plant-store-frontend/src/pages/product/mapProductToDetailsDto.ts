// pages/product/mapProductToDetailsDto.ts
import type { Product } from "../../types/Product";
import type { ProductDetailsDto } from "../../types/ProductDetailsDto";
import type { ReviewResponseDto } from "../../types/Review";

export function mapProductToDetailsDto(
  product: Product,
  reviews: ReviewResponseDto[]
): ProductDetailsDto {
  return {
    productId: product.id,
    name: product.name,
    price: product.price,
    stock: product.inStock,
    defaultImageUrl: product.defaultImageUrl,
    imageUrls: product.imageUrls ?? [],
    description: product.description,
    shortDescription: product.description.slice(0, 120) + "...",
    reviews,
  };
}
