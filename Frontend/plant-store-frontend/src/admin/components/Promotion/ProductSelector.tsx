import type { ProductDto } from "../../../types/ProductDto";

interface Props {
  products: ProductDto[];
  selectedIds: number[];
  onToggle: (productId: number) => void;
}

export default function ProductSelector({
  products,
  selectedIds,
  onToggle,
}: Props) {
  return (
    <div>
      <p className="text-sm font-medium mb-2">Produkty objęte promocją:</p>
      <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto border p-2 rounded">
        {products.map((product) => (
          <label key={product.id} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={selectedIds.includes(product.id)}
              onChange={() => onToggle(product.id)}
            />
            <span>{product.name} ({product.price.toFixed(2)} zł)</span>
          </label>
        ))}
      </div>
    </div>
  );
}
