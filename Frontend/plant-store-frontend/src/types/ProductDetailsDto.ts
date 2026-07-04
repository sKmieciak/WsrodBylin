// types/ProductDetailsDto.ts

import type { ReviewResponseDto } from "./Review";

export interface ProductDetailsDto {
  productId: number;
  name: string;
  price: number;
  stock: number;
  defaultImageUrl: string;
  imageUrls: string[];
  description: string;
  shortDescription?: string;
  reviews: ReviewResponseDto[];
}
