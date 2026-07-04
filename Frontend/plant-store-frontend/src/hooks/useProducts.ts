import { useEffect, useState } from "react";
import { getProducts } from "../api/productsApi";
import { fetchActivePromotions } from "../api/publicPromotionApi";
import type { Product } from "../types/Product";
import type { PromotionDto } from "../types/PromotionDto";

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [promotions, setPromotions] = useState<PromotionDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getProducts(), fetchActivePromotions()])
      .then(([productsData, promotionsData]) => {
        setProducts(productsData);
        setPromotions(promotionsData);
      })
      .finally(() => setLoading(false));
  }, []);

  return { products, promotions, loading };
}
