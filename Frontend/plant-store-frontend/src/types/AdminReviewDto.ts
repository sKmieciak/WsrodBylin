export interface AdminReviewDto {
  id: number;
  authorName: string;
  email: string;
  content: string;
  rating: number;
  createdAt: string;
  isVisible: boolean;
  productId: number;
  productName: string;
}
