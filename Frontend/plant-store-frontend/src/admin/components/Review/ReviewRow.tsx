import type { AdminReviewDto } from "../../../types/AdminReviewDto";
import { Eye, EyeOff, Trash2 } from "lucide-react";

interface Props {
  review: AdminReviewDto;
  onDelete: (id: number) => void;
  onToggle: (id: number) => void;
}

export default function ReviewRow({ review, onDelete, onToggle }: Props) {
  return (
    <tr className="border-t hover:bg-gray-50">
      <td className="px-4 py-2">{review.authorName}</td>
      <td className="px-4 py-2">{review.email}</td>
      <td className="px-4 py-2">{review.productName}</td>
      <td className="px-4 py-2">{review.rating}/5</td>
      <td className="px-4 py-2 max-w-sm truncate">{review.content}</td>
      <td className="px-4 py-2 text-center">
        {review.isVisible ? (
          <span className="text-green-600">Widoczna</span>
        ) : (
          <span className="text-gray-500">Ukryta</span>
        )}
      </td>
      <td className="px-4 py-2 text-center space-x-2">
        <button onClick={() => onToggle(review.id)} className="text-indigo-600 hover:text-indigo-800">
          {review.isVisible ? <Eye className="inline w-4 h-4" /> : <EyeOff className="inline w-4 h-4" />}
        </button>
        <button onClick={() => onDelete(review.id)} className="text-red-500 hover:text-red-700">
          <Trash2 className="inline w-4 h-4" />
        </button>
      </td>
    </tr>
  );
}
