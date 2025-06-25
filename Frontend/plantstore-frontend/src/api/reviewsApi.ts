import axios from "axios";
import { API_URL } from "../data/Api_URL";
import type { ReviewResponseDto } from "../types/Review";

interface ReviewRequestDto {
  authorName: string;
  email: string;
  content: string;
  rating: number;
}

export const getReviews = async (productId: number): Promise<ReviewResponseDto[]> => {
  const res = await axios.get(`${API_URL}api/products/${productId}/reviews`);
  return res.data;
};

export const postReview = async (
  productId: number,
  data: ReviewRequestDto
): Promise<ReviewResponseDto> => {
  const res = await axios.post(`${API_URL}api/products/${productId}/reviews`, data);
  return res.data;
};
