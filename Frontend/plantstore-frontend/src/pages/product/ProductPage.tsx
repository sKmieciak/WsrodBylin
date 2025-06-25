import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProductById } from "../../api/productsApi";
import { getReviews } from "../../api/reviewsApi";
import type { Product } from "../../types/Product";
import type { ReviewResponseDto } from "../../types/Review";
import ProductDetails from "../../components/ProductDetails/ProductDetails";
import { mapProductToDetailsProps } from "./mapProductToDetailsProps";

export function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<ReviewResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReviews = async (productId: number) => {
    try {
      const data = await getReviews(productId);
      setReviews(data);
    } catch {
      setError("Nie udało się załadować opinii.");
    }
  };

  useEffect(() => {
    const productId = Number(id);
    if (!productId) {
      setError("Nieprawidłowy identyfikator produktu.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    Promise.all([getProductById(productId), getReviews(productId)])
      .then(([productData, reviewData]) => {
        setProduct(productData);
        setReviews(reviewData);
      })
      .catch(() => setError("Wystąpił błąd podczas ładowania danych."))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p>Wczytywanie...</p>;
  if (error) return <p>{error}</p>;
  if (!product) return <p>Nie znaleziono produktu.</p>;

  return (
    <ProductDetails
      {...mapProductToDetailsProps(product, reviews)}
      productId={product.id}
      onReviewAdded={() => fetchReviews(product.id)}
    />
  );
}
