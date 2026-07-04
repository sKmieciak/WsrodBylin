import { useEffect, useState } from "react";
import DiscountFields from "./DiscountFields";
import ProductSelector from "./ProductSelector";
import type { PromotionDto } from "../../../types/PromotionDto";
import type { ProductDto } from "../../../types/ProductDto";

interface Props {
  onSubmit: (data: PromotionDto) => void;
  onClose: () => void;
  defaultValues?: PromotionDto;
  submitting: boolean;
  products: ProductDto[];
}

export default function PromotionForm({
  onSubmit,
  onClose,
  defaultValues,
  submitting,
  products,
}: Props) {
  const [form, setForm] = useState<PromotionDto>(
    defaultValues || {
      id: 0,
      name: "",
      description: "",
      discountPercentage: 0,
      startDate: new Date().toISOString().slice(0, 10),
      endDate: new Date().toISOString().slice(0, 10),
      productIds: [],
    }
  );

  const [discountValue, setDiscountValue] = useState(0);

  const getAvgPrice = () => {
    if (!form.productIds.length) return 0;
    const selected = products.filter(p => form.productIds.includes(p.id));
    return selected.reduce((acc, p) => acc + p.price, 0) / selected.length;
  };

  useEffect(() => {
    const avg = getAvgPrice();
    setDiscountValue(parseFloat(((avg * form.discountPercentage) / 100).toFixed(2)));
  }, [form.discountPercentage, form.productIds]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "discountPercentage" ? +value : value,
    }));
  };

  const handleDiscountValueChange = (val: number) => {
    const avg = getAvgPrice();
    const percent = avg ? (val / avg) * 100 : 0;
    setForm(prev => ({
      ...prev,
      discountPercentage: parseFloat(percent.toFixed(2))
    }));
    setDiscountValue(val);
  };

  const handleCheckboxChange = (id: number) => {
    setForm((prev) => ({
      ...prev,
      productIds: prev.productIds.includes(id)
        ? prev.productIds.filter(pid => pid !== id)
        : [...prev.productIds, id],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        name="name"
        placeholder="Nazwa"
        value={form.name}
        onChange={handleChange}
        required
        className="w-full border rounded px-3 py-2"
      />
      <textarea
        name="description"
        placeholder="Opis"
        value={form.description}
        onChange={handleChange}
        required
        className="w-full border rounded px-3 py-2"
      />

      <DiscountFields
        percentage={form.discountPercentage}
        value={discountValue}
        onPercentageChange={handleChange}
        onValueChange={handleDiscountValueChange}
      />

      <div className="flex gap-4">
        <input
          type="date"
          name="startDate"
          value={form.startDate}
          onChange={handleChange}
          className="flex-1 border rounded px-3 py-2"
        />
        <input
          type="date"
          name="endDate"
          value={form.endDate}
          onChange={handleChange}
          className="flex-1 border rounded px-3 py-2"
        />
      </div>

      <ProductSelector
        products={products}
        selectedIds={form.productIds}
        onToggle={handleCheckboxChange}
      />

      <div className="flex justify-end gap-2 pt-4">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300">
          Anuluj
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700">
          {submitting ? "Zapisywanie..." : "Zapisz"}
        </button>
      </div>
    </form>
  );
}
