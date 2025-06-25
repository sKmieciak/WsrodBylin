import { useState } from "react";
import { X } from "lucide-react";
import { postReview } from "../../api/reviewsApi";
import { ReviewFormFields } from "./ReviewFormFields";

interface Props {
  open: boolean;
  onClose: () => void;
  productId: number;
  onReviewAdded: () => void;
}

export function ReviewModal({
  open,
  onClose,
  productId,
  onReviewAdded,
}: Props) {
  const [authorName, setAuthorName] = useState("");
  const [email, setEmail] = useState("");
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(5);
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await postReview(productId, {
        authorName,
        email,
        content,
        rating,
      });

      setAuthorName("");
      setEmail("");
      setContent("");
      setRating(5);
      onReviewAdded();
      onClose();
    } catch (error) {
      alert("Nie udało się wysłać opinii.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white w-full max-w-xl mx-4 rounded-2xl p-6 shadow-lg relative animate-fade-in">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          onClick={onClose}>
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-2xl font-bold mb-2">Dodaj opinię</h2>
        <p className="text-gray-600 text-sm mb-6">Twoja recenzja produktu</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <ReviewFormFields
            authorName={authorName}
            setAuthorName={setAuthorName}
            email={email}
            setEmail={setEmail}
            content={content}
            setContent={setContent}
            rating={rating}
            setRating={setRating}
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-500 text-white py-2 rounded-md hover:bg-emerald-600 disabled:opacity-50">
            {loading ? "Wysyłanie..." : "Dodaj opinię"}
          </button>
        </form>
      </div>
    </div>
  );
}
