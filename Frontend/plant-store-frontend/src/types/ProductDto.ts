export interface ProductDto {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrls: string[];
  defaultImageUrl?: string;
  inStock: number;
  categoryId: number;
  categoryName: string | null;
}

// DTO do tworzenia i edycji (bez id i categoryName)
export type ProductCreateDto = Omit<ProductDto, "id" | "categoryName">;
export type ProductUpdateDto = ProductCreateDto;
