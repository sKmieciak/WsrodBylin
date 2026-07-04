import axios from "../../lib/axios";
import { API_URL } from "../../data/Api_URL";
import type { PromotionDto } from "../../types/PromotionDto";
import type { CreatePromotionDto } from "../../types/CreatePromotionDto";

const ENDPOINT = `${API_URL}api/promotions`;

export const fetchPromotions = async (): Promise<PromotionDto[]> => {
  const response = await axios.get(ENDPOINT);
  return response.data;
};

export const createPromotion = async (promotion: CreatePromotionDto): Promise<void> => {
  await axios.post(ENDPOINT, promotion);
};

export const updatePromotion = async (id: number, promotion: CreatePromotionDto): Promise<void> => {
  await axios.put(`${ENDPOINT}/${id}`, promotion);
};

export const deletePromotion = async (id: number): Promise<void> => {
  await axios.delete(`${ENDPOINT}/${id}`);
};
