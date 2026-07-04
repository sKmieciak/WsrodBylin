import { useEffect, useState } from "react";
import {
  fetchPromotions,
  deletePromotion,
  createPromotion,
  updatePromotion,
} from "../Api/promotionApi";
import { fetchAdminProducts } from "../Api/productApi"; // ✅ dodaj to
import PromotionTable from "../components/Promotion/PromotionTable.tsx";
import PromotionFormModal from "../components/Promotion/PromotionFormModal";
import type { PromotionDto } from "../../types/PromotionDto";
import type { ProductDto } from "../../types/ProductDto";

export default function Promotions() {
  const [promotions, setPromotions] = useState<PromotionDto[]>([]);
  const [products, setProducts] = useState<ProductDto[]>([]); // ✅
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [editingPromotion, setEditingPromotion] = useState<PromotionDto | null>(
    null
  );

  const loadPromotions = async () => {
    setLoading(true);
    try {
      const data = await fetchPromotions();
      setPromotions(data);
    } catch (err) {
      console.error("Błąd podczas pobierania promocji:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadProducts = async () => {
    try {
      const data = await fetchAdminProducts();
      setProducts(data);
    } catch (err) {
      console.error("Błąd podczas pobierania produktów:", err);
    }
  };

  useEffect(() => {
    loadPromotions();
    loadProducts(); // ✅ pobierz produkty
  }, []);

  const handleDelete = async (id: number) => {
    if (confirm("Na pewno chcesz usunąć tę promocję?")) {
      await deletePromotion(id);
      loadPromotions();
    }
  };

  const handleSubmit = async (
    data: PromotionDto & { productIds: number[] }
  ) => {
    setSubmitting(true);
    setSaveError(null);
    try {
      if (editingPromotion) {
        await updatePromotion(editingPromotion.id, data);
      } else {
        await createPromotion(data);
      }
      await loadPromotions();
      setModalOpen(false);
      setEditingPromotion(null);
    } catch {
      setSaveError("Błąd przy zapisie promocji. Spróbuj ponownie.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Promocje</h2>
        {saveError && <p className="text-red-600 text-sm">{saveError}</p>}
        <button
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          onClick={() => {
            setEditingPromotion(null);
            setModalOpen(true);
          }}>
          + Dodaj promocję
        </button>
      </div>

      {loading ? (
        <div className="text-center text-gray-500 py-10">
          Ładowanie promocji...
        </div>
      ) : (
        <PromotionTable
          promotions={promotions}
          onDelete={handleDelete}
          onEdit={(promotion: PromotionDto) => {
            setEditingPromotion(promotion);
            setModalOpen(true);
          }}
        />
      )}

      <PromotionFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        defaultValues={editingPromotion || undefined}
        submitting={submitting}
        products={products} // ✅ PRZEKAZUJEMY PRODUKTY
      />
    </div>
  );
}
