import type { PromotionDto } from "../../../types/PromotionDto";

interface Props {
  promotions: PromotionDto[];
  onDelete: (id: number) => void;
  onEdit: (promotion: PromotionDto) => void;
}

export default function PromotionTable({ promotions, onDelete, onEdit }: Props) {
  return (
    <table className="min-w-full bg-white border border-gray-200">
      <thead>
        <tr className="bg-gray-100">
          <th className="py-2 px-4 border-b">Nazwa</th>
          <th className="py-2 px-4 border-b">Opis</th>
          <th className="py-2 px-4 border-b">% zniżki</th>
          <th className="py-2 px-4 border-b">Od</th>
          <th className="py-2 px-4 border-b">Do</th>
          <th className="py-2 px-4 border-b">Akcje</th>
        </tr>
      </thead>
      <tbody>
        {promotions.map((promotion) => (
          <tr key={promotion.id} className="text-sm">
            <td className="py-2 px-4 border-b">{promotion.name}</td>
            <td className="py-2 px-4 border-b">{promotion.description}</td>
            <td className="py-2 px-4 border-b">{promotion.discountPercentage}%</td>
            <td className="py-2 px-4 border-b">{promotion.startDate.slice(0, 10)}</td>
            <td className="py-2 px-4 border-b">{promotion.endDate.slice(0, 10)}</td>
            <td className="py-2 px-4 border-b space-x-2">
              <button
                className="text-blue-600 hover:underline"
                onClick={() => onEdit(promotion)}
              >
                Edytuj
              </button>
              <button
                className="text-red-600 hover:underline"
                onClick={() => onDelete(promotion.id)}
              >
                Usuń
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
