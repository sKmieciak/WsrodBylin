// src/pages/promotions/PromotionPage.tsx
import { useEffect, useState } from "react";
import { fetchActivePromotions } from "../../api/publicPromotionApi";
import { getProductById } from "../../api/productsApi";
import type { PromotionDto } from "../../types/PromotionDto";
import type { Product } from "../../types/Product";
import PromotionCard from "../../components/Promotions/PromotionCard";
import PromotionSlider from "../../components/Promotions/PromotionsSlider";

export default function PromotionsPage() {
  const [promotions, setPromotions] = useState<PromotionDto[]>([]);
  const [productsInPromotions, setProductsInPromotions] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPromotionsAndProducts = async () => {
      try {
        const promos = await fetchActivePromotions();
        setPromotions(promos);

        const allProductIds = Array.from(new Set(promos.flatMap((p) => p.productIds)));
        const fetchedProducts = await Promise.all(allProductIds.map((id) => getProductById(id)));

        setProductsInPromotions(fetchedProducts);
      } catch (error) {
        console.error("Błąd podczas pobierania promocji lub produktów:", error);
      } finally {
        setLoading(false);
      }
    };

    loadPromotionsAndProducts();
  }, []);

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-3xl font-bold mb-6 text-center">Aktualne promocje</h2>

      {loading ? (
        <p className="text-center text-gray-500">Ładowanie promocji...</p>
      ) : promotions.length === 0 ? (
        <p className="text-center text-gray-500">Brak aktywnych promocji.</p>
      ) : (
        <>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            {promotions.map((promo) => (
              <PromotionCard key={promo.id} promotion={promo} />
            ))}
          </div>

          <h3 className="text-xl font-semibold mt-10 mb-4 text-center">Produkty objęte promocją</h3>
<PromotionSlider
  products={productsInPromotions}
  promotions={promotions}
/>
        </>
      )}
    </div>
  );
}
