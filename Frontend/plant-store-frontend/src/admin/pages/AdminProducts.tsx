import { useState } from "react";
import ProductTable from "../components/Product/ProductTable";
import ProductFormModal from "../components/Product/ProductFormModal";
import type { ProductDto } from "../../types/ProductDto";
import { useAdminProducts } from "../../hooks/useAdminProducts";

export default function Products() {
  const { products, loading, submitting, create, update, remove } = useAdminProducts();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductDto | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  const handleDelete = async (id: number) => {
    if (confirm("Na pewno chcesz usunąć ten produkt?")) {
      await remove(id);
    }
  };

  const handleSubmit = async (formData: FormData) => {
    setSaveError(null);
    try {
      if (editingProduct) {
        await update(editingProduct.id, formData);
      } else {
        await create(formData);
      }
      setModalOpen(false);
      setEditingProduct(null);
    } catch {
      setSaveError("Błąd przy zapisie produktu. Spróbuj ponownie.");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Produkty</h2>
        {saveError && <p className="text-red-600 text-sm">{saveError}</p>}
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
