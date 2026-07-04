import axios from "../lib/axios";
import { API_URL } from "../data/Api_URL";
import type { PromotionDto } from "../types/PromotionDto";


export const fetchActivePromotions = async (): Promise<PromotionDto[]> => {
  const response = await axios.get(`${API_URL}api/PublicPromotions/active`);
  return response.data;
};
