export interface CreatePromotionDto {
  name: string;
  discountPercentage: number;
  startDate: string; // lub Date – zależnie jak przekazujesz
  endDate: string;
  productIds: number[];
}
