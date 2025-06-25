import { useEffect, useState } from "react";
import {
  fetchAdminProducts,
  deleteProduct,
  createProduct,
  updateProduct,
} from "../Api/productApi";
import ProductTable from "../components/ProductTable";
import ProductFormModal from "../components/ProductFormModal";
import type { ProductDto } from "../../types/ProductDto";

export default function Products() {
  const [products, setProducts] = useState<ProductDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductDto | null>(null);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await fetchAdminProducts();
      setProducts(data);
    } catch (err) {
      console.error("Błąd podczas pobierania produktów:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleDelete = async (id: number) => {
    if (confirm("Na pewno chcesz usunąć ten produkt?")) {
      await deleteProduct(id);
      loadProducts();
    }
  };

  const handleSubmit = async (formData: FormData) => {
    setSubmitting(true);
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, formData);
      } else {
        await createProduct(formData);
      }
      await loadProducts();
      setModalOpen(false);
      setEditingProduct(null);
    } catch (err) {
      console.error("Błąd przy zapisie produktu:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Produkty</h2>
        <button
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          onClick={() => {
            setEditingProduct(null);
            setModalOpen(true);
          }}
        >
          + Dodaj produkt
        </button>
      </div>

      {loading ? (
        <div className="text-center text-gray-500 py-10">Ładowanie produktów...</div>
      ) : (
        <ProductTable
          products={products}
          onDelete={handleDelete}
          onEdit={(product: ProductDto) => {
            setEditingProduct(product);
            setModalOpen(true);
          }}
        />
      )}

      <ProductFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        defaultValues={editingProduct || undefined}
        submitting={submitting}
      />
    </div>
  );
}
