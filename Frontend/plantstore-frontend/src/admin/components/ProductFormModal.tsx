import ProductForm from "./ProductForm";
import type { ProductDto } from "../../types/ProductDto";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FormData) => void;
  defaultValues?: ProductDto;
  submitting?: boolean;
};

export default function ProductFormModal({
  isOpen,
  onClose,
  onSubmit,
  defaultValues,
  submitting,
}: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-2xl shadow-md">
        <h2 className="text-2xl font-semibold mb-6">
          {defaultValues ? `Edytuj: ${defaultValues.name}` : "Dodaj nowy produkt"}
        </h2>
        <ProductForm
          defaultValues={defaultValues}
          onSubmit={onSubmit}
          onCancel={onClose}
          disabled={submitting}
        />
      </div>
    </div>
  );
}
