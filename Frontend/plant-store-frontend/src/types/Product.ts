export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  defaultImageUrl: string;
  imageUrls: string[]; // ⬅️ dodaj to
  inStock: number;
  isNew?: boolean;
  categoryName: string | null;
}
