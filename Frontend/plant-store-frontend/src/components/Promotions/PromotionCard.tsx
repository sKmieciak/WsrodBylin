import type { PromotionDto } from "../../types/PromotionDto";

interface Props {
  promotion: PromotionDto;
}

export default function PromotionCard({ promotion }: Props) {
  return (
    <div className="border border-gray-200 rounded-lg shadow-sm bg-white p-5 hover:shadow-md transition-shadow duration-300">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xl font-semibold text-gray-800">
          {promotion.name}
        </h3>
        <span className="bg-green-100 text-green-700 text-sm font-bold px-3 py-1 rounded-full">
          -{promotion.discountPercentage}%
        </span>
      </div>

      {promotion.description && (
        <p className="text-gray-600 text-sm mb-4 leading-relaxed">
          {promotion.description}
        </p>
      )}

      <div className="text-xs text-gray-500 border-t pt-2">
        <span className="font-medium text-gray-700">Czas trwania:</span>{" "}
        {promotion.startDate.slice(0, 10)} – {promotion.endDate.slice(0, 10)}
      </div>
    </div>
  );
}
