export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  inStock: number;
  categoryName: string | null;
}
