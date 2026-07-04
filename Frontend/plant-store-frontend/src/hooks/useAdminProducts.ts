import { useEffect, useState } from "react";
import {
  fetchAdminProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../admin/Api/productApi";
import type { ProductDto } from "../types/ProductDto";

export function useAdminProducts() {
  const [products, setProducts] = useState<ProductDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
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

  const create = async (formData: FormData) => {
    setSubmitting(true);
    try {
      await createProduct(formData);
      await load();
    } catch (err) {
      console.error("Błąd przy tworzeniu produktu:", err);
      throw err;
    } finally {
      setSubmitting(false);
    }
  };

  const update = async (id: number, formData: FormData) => {
    setSubmitting(true);
    try {
      await updateProduct(id, formData);
      await load();
    } catch (err) {
      console.error("Błąd przy aktualizacji produktu:", err);
      throw err;
    } finally {
      setSubmitting(false);
    }
  };

  const remove = async (id: number) => {
    await deleteProduct(id);
    await load();
  };

  useEffect(() => {
    load();
  }, []);

  return { products, loading, submitting, create, update, remove };
}
