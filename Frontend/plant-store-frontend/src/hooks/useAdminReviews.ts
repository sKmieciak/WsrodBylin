import { useEffect, useState } from "react";
import { fetchReviews, deleteReview, approveReview, rejectReview } from "../admin/Api/AdminReviewApi";
import type { AdminReviewDto } from "../types/AdminReviewDto";

export function useAdminReviews() {
  const [reviews, setReviews] = useState<AdminReviewDto[]>([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      setReviews(await fetchReviews());
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id: number) => {
    await deleteReview(id);
    setReviews((prev) => prev.filter((r) => r.id !== id));
  };

  const approve = async (id: number) => {
    await approveReview(id);
    setReviews((prev) => prev.map((r) => r.id === id ? { ...r, isVisible: true } : r));
  };

  const reject = async (id: number) => {
    await rejectReview(id);
    setReviews((prev) => prev.map((r) => r.id === id ? { ...r, isVisible: false } : r));
  };

  useEffect(() => { load(); }, []);

  return { reviews, loading, remove, approve, reject };
}
