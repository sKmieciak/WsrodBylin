import { ProductList } from "../../components/ProductList/ProductList";
import { usePageTitle } from "../../hooks/usePageTitle";

export const ProductListPage = () => {
  usePageTitle("Wszystkie rośliny");
  return (
    <main className="container py-8">
      <ProductList />
    </main>
  );
};
