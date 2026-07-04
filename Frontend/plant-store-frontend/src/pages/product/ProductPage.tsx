import { useParams } from "react-router-dom";
import ProductDetails from "../../components/ProductDetails/ProductDetails";
import { mapProductToDetailsDto } from "./mapProductToDetailsDto";
import { useProduct } from "../../hooks/useProduct";
import { usePageTitle } from "../../hooks/usePageTitle";

export function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const productId = Number(id);

  const { product, reviews, promotion, loading, error, refreshReviews } =
    useProduct(productId);

  usePageTitle(product?.name);

  if (loading) return <p>Wczytywanie...</p>;
  if (error) return <p>{error}</p>;
  if (!product) return <p>Nie znaleziono produktu.</p>;

  return (
    <ProductDetails
      {...mapProductToDetailsDto(product, reviews)}
      promotion={promotion}
      onReviewAdded={refreshReviews}
    />
  );
}
