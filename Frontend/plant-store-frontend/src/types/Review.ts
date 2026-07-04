export interface ReviewResponseDto {
  id: number;
  authorName: string;
  content: string;
  rating: number;
  createdAt: string; // ISO string
}
