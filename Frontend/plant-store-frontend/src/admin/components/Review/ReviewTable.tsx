import type { AdminReviewDto } from "../../../types/AdminReviewDto";
import ReviewRow from "./ReviewRow";
import { Loader2 } from "lucide-react";

interface Props {
  reviews: AdminReviewDto[];
  loading: boolean;
  onDelete: (id: number) => void;
  onToggle: (id: number) => void;
}

export default function ReviewTable({ reviews, loading, onDelete, onToggle }: Props) {
  if (loading) {
    return <div className="flex items-center space-x-2 text-gray-600"><Loader2 className="animate-spin" /> <span>Ładowanie...</span></div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border rounded shadow-sm text-sm">
        <thead className="bg-gray-100 uppercase text-gray-600">
          <tr>
            <th className="px-4 py-2">Autor</th>
            <th className="px-4 py-2">Email</th>
            <th className="px-4 py-2">Produkt</th>
            <th className="px-4 py-2">Ocena</th>
            <th className="px-4 py-2">Treść</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2 text-center">Akcje</th>
          </tr>
        </thead>
        <tbody>
          {reviews.map(r => (
            <ReviewRow key={r.id} review={r} onDelete={onDelete} onToggle={onToggle} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
