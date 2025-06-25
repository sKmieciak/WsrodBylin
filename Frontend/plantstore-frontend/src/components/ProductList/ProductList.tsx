import { useEffect, useState } from "react";
import { getProducts } from "../../api/productsApi";
import type { Product } from "../../types/Product";
import { ProductCard } from "../ProductCard/ProductCard";
import { FilterSidebar } from "../FilterSidebar/FilterSidebar";
import { useCategory } from "../../context/CategoryContext";

export const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const { selectedCategory } = useCategory();
  const [priceFilter, setPriceFilter] = useState<{
    min: number | null;
    max: number | null;
  }>({
    min: null,
    max: null,
  });

  useEffect(() => {
    getProducts().then(setProducts);
  }, []);

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
        <div className="grid gap-6 grid-cols-[repeat(auto-fit,_minmax(220px,_1fr))]">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};
