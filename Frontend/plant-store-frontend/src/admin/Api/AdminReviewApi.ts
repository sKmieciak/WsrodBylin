import axios from "../../lib/axios";
import { API_URL } from "../../data/Api_URL";
import type { AdminReviewDto } from "../../types/AdminReviewDto";

export const fetchReviews = async (): Promise<AdminReviewDto[]> => {
  const response = await axios.get(`${API_URL}api/admin/reviews`);
  return response.data;
};

export const approveReview = async (id: number): Promise<void> => {
  await axios.put(`${API_URL}api/admin/reviews/${id}/approve`);
};

export const rejectReview = async (id: number): Promise<void> => {
  await axios.put(`${API_URL}api/admin/reviews/${id}/reject`);
};

export const deleteReview = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}api/admin/reviews/${id}`);
};
