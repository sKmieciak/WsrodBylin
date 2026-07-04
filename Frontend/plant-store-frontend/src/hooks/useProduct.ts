import { useEffect, useState } from "react";
import { getProductById } from "../api/productsApi";
import { getReviews } from "../api/reviewsApi";
import { fetchActivePromotions } from "../api/publicPromotionApi";
import type { Product } from "../types/Product";
import type { ReviewResponseDto } from "../types/Review";
import type { PromotionDto } from "../types/PromotionDto";

export function useProduct(id: number) {
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<ReviewResponseDto[]>([]);
  const [promotion, setPromotion] = useState<PromotionDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshReviews = async () => {
    try {
      const data = await getReviews(id);
      setReviews(data);
    } catch {
      // opinie się nie przeładowały — nie blokujemy UX
    }
  };

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);

    Promise.all([getProductById(id), getReviews(id), fetchActivePromotions()])
      .then(([productData, reviewData, promos]) => {
        setProduct(productData);
        setReviews(reviewData);
        setPromotion(promos.find((p) => p.productIds.includes(id)) ?? null);
      })
      .catch(() => setError("Wystąpił błąd podczas ładowania danych."))
      .finally(() => setLoading(false));
  }, [id]);

  return { product, reviews, promotion, loading, error, refreshReviews };
}
