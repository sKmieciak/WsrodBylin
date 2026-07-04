import { useState } from "react";
import type { ReviewResponseDto } from "../../types/Review";
import Review from "../Review/Review";
import { ReviewModal } from "../Review/ReviewModal";

interface ProductTabsProps {
  description: string;
  reviews: ReviewResponseDto[];
  productId: number;
  onReviewAdded: () => void;
}

export default function ProductTabs({ description, reviews, productId, onReviewAdded }: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState<"description" | "reviews">("description");
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="mt-8 bg-white p-6 rounded-2xl shadow border">
      <div className="flex space-x-6 border-b pb-2 mb-4">
        <button
          className={`font-semibold pb-1 border-b-2 ${activeTab === "description" ? "border-green-600 text-green-700" : "border-transparent text-gray-600"}`}
          onClick={() => setActiveTab("description")}
        >
          Opis produktu
        </button>
        <button
          className={`font-semibold pb-1 border-b-2 ${activeTab === "reviews" ? "border-green-600 text-green-700" : "border-transparent text-gray-600"}`}
          onClick={() => setActiveTab("reviews")}
        >
          Opinie
        </button>
      </div>

      {activeTab === "description" && (
        <div className="text-gray-800 whitespace-pre-line">{description}</div>
      )}

      {activeTab === "reviews" && (
        <div className="space-y-4">
          {reviews.length === 0 ? (
            <p className="text-gray-500">Brak opinii.</p>
          ) : (
            reviews.map((review) => (
              <Review
                key={review.id}
                author={review.authorName}
                content={review.content}
                rating={review.rating}
                createdAt={review.createdAt}
              />
            ))
          )}

          <div className="pt-4">
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
            >
              Dodaj opinię
            </button>
          </div>

          <ReviewModal
            open={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            productId={productId}
            onReviewAdded={() => {
              setIsModalOpen(false);
              onReviewAdded();
            }}
          />
        </div>
      )}
    </div>
  );
}
