import { useState } from "react";
import { ProductCard } from "../ProductCard/ProductCard";
import { FilterSidebar } from "../FilterSidebar/FilterSidebar";
import { useCategory } from "../../context/CategoryContext";
import { useProducts } from "../../hooks/useProducts";

const SkeletonCard = () => (
  <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden flex flex-col p-3 h-full animate-pulse">
    <div className="w-full h-40 sm:h-48 rounded-lg bg-gray-200" />
    <div className="mt-3 flex-1 space-y-2">
      <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto" />
      <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto" />
      <div className="h-3 bg-gray-200 rounded w-full" />
    </div>
    <div className="w-full mt-4 h-9 bg-gray-200 rounded-md" />
  </div>
);

export const ProductList = () => {
  const { products, promotions, loading } = useProducts();
  const [search, setSearch] = useState("");
  const { selectedCategory } = useCategory();
  const [priceFilter, setPriceFilter] = useState<{
    min: number | null;
    max: number | null;
  }>({ min: null, max: null });

  const filtered = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory ? p.categoryName === selectedCategory : true;
    const matchesMinPrice = priceFilter.min === null || p.price >= priceFilter.min;
    const matchesMaxPrice = priceFilter.max === null || p.price <= priceFilter.max;
    return matchesSearch && matchesCategory && matchesMinPrice && matchesMaxPrice;
  });

  return (
    <div className="container">
      <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-8">
        <FilterSidebar
          onSearch={setSearch}
          onPriceChange={(min, max) => setPriceFilter({ min, max })}
        />
        <div>
          {loading ? (
            <div className="grid gap-6 grid-cols-[repeat(auto-fit,_minmax(220px,_1fr))]">
              {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center text-gray-500">
              <span className="text-5xl mb-4">🌿</span>
              <p className="text-lg font-medium">Brak produktów w tej kategorii</p>
              <p className="text-sm mt-1">Sprawdź ponownie wkrótce lub wybierz inną kategorię.</p>
            </div>
          ) : (
            <div className="grid gap-6 grid-cols-[repeat(auto-fit,_minmax(220px,_1fr))]">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} promotions={promotions} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
