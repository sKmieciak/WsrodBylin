export interface PromotionDto {
  id: number;
  name: string;
  description: string;
  discountPercentage: number;
  startDate: string;   // ISO string
  endDate: string;     // ISO string
  productIds: number[]; // ✅ dodaj to pole
}
