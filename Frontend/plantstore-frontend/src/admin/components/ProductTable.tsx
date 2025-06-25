// src/admin/components/ProductTable.tsx
import type { ProductDto } from "../../types/ProductDto";
import { Trash2, Pencil } from "lucide-react";

type Props = {
  products: ProductDto[];
  onDelete: (id: number) => void;
  onEdit: (product: ProductDto) => void;
};

export default function ProductTable({ products, onDelete, onEdit }: Props) {
  return (
    <div className="border rounded-lg overflow-x-auto">
      <table className="min-w-full bg-white text-sm">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="px-4 py-2">Nazwa</th>
            <th className="px-4 py-2">Kategoria</th>
            <th className="px-4 py-2">Cena</th>
            <th className="px-4 py-2">Stan magazynowy</th>
            <th className="px-4 py-2 text-center">Akcje</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id} className="border-t">
              <td className="px-4 py-2">{p.name}</td>
              <td className="px-4 py-2">{p.categoryName}</td>
              <td className="px-4 py-2">{p.price.toFixed(2)} zł</td>
              <td className="px-4 py-2">{p.inStock}</td>
              <td className="px-4 py-2 text-center space-x-2">
                <button
                  className="text-blue-600 hover:text-blue-800"
                  title="Edytuj"
                  onClick={() => onEdit(p)}
                >
                  <Pencil size={18} />
                </button>
                <button
                  className="text-red-600 hover:text-red-800"
                  title="Usuń"
                  onClick={() => onDelete(p.id)}
                >
                  <Trash2 size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
