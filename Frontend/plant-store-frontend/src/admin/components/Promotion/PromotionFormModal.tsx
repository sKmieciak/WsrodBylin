import PromotionForm from "./PromotionForm";
import type { PromotionDto } from "../../../types/PromotionDto";
import type { ProductDto } from "../../../types/ProductDto";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: PromotionDto) => void;
  defaultValues?: PromotionDto;
  submitting: boolean;
  products: ProductDto[];
}

export default function PromotionFormModal({
  isOpen,
  onClose,
  onSubmit,
  defaultValues,
  submitting,
  products,
}: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start pt-20 z-50">
      <div className="bg-white rounded-md p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-semibold mb-4">
          {defaultValues ? "Edytuj promocję" : "Dodaj promocję"}
        </h3>
        <PromotionForm
          onSubmit={onSubmit}
          onClose={onClose}
          defaultValues={defaultValues}
          submitting={submitting}
          products={products}
        />
      </div>
    </div>
  );
}
