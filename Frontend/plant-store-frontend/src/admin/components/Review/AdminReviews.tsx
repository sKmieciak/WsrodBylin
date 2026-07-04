import { useEffect, useState } from "react";
import { fetchReviews, approveReview, rejectReview, deleteReview } from "../../Api/AdminReviewApi";
import type { AdminReviewDto } from "../../../types/AdminReviewDto";
import { Check, X, Trash2, Star } from "lucide-react";

export default function AdminReviews() {
  const [reviews, setReviews] = useState<AdminReviewDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"pending" | "approved">("pending");

  const load = async () => {
    setLoading(true);
    try {
      setReviews(await fetchReviews());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const pending = reviews.filter((r) => !r.isVisible);
  const approved = reviews.filter((r) => r.isVisible);
  const shown = tab === "pending" ? pending : approved;

  const handleApprove = async (id: number) => {
    await approveReview(id);
    setReviews((prev) => prev.map((r) => r.id === id ? { ...r, isVisible: true } : r));
  };

  const handleReject = async (id: number) => {
    await rejectReview(id);
    setReviews((prev) => prev.map((r) => r.id === id ? { ...r, isVisible: false } : r));
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Na pewno usunąć tę recenzję?")) return;
    await deleteReview(id);
    setReviews((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Recenzje produktów</h1>

      {/* Tabs */}
      <div className="flex gap-0 border-b border-gray-200 mb-6">
        {(["pending", "approved"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              tab === t ? "border-green-600 text-green-700" : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {t === "pending" ? "Oczekujące" : "Zatwierdzone"}
            <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${
              t === "pending" ? "bg-orange-100 text-orange-700" : "bg-green-100 text-green-700"
            }`}>
              {t === "pending" ? pending.length : approved.length}
            </span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center text-gray-500 py-10">Ładowanie...</div>
      ) : shown.length === 0 ? (
        <div className="text-center text-gray-400 py-10">
          {tab === "pending" ? "Brak oczekujących recenzji" : "Brak zatwierdzonych recenzji"}
        </div>
      ) : (
        <div className="space-y-4">
          {shown.map((r) => (
            <div key={r.id} className="bg-white border rounded-xl p-4 flex flex-col sm:flex-row gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-sm">{r.authorName}</span>
                  <span className="text-xs text-gray-400">{r.email}</span>
                  <span className="ml-auto text-xs text-gray-400">
                    {new Date(r.createdAt).toLocaleDateString("pl-PL")}
                  </span>
                </div>
                <div className="text-xs text-green-700 font-medium mb-1">{r.productName}</div>
                <div className="flex gap-0.5 mb-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`w-3.5 h-3.5 ${i < r.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-200 fill-gray-200"}`} />
                  ))}
                </div>
                <p className="text-sm text-gray-700">{r.content}</p>
              </div>

              <div className="flex sm:flex-col gap-2 sm:items-end justify-end flex-shrink-0">
                {tab === "pending" ? (
                  <button
                    onClick={() => handleApprove(r.id)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700"
                  >
                    <Check className="w-3.5 h-3.5" /> Zatwierdź
                  </button>
                ) : (
                  <button
                    onClick={() => handleReject(r.id)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-300"
                  >
                    <X className="w-3.5 h-3.5" /> Ukryj
                  </button>
                )}
                <button
                  onClick={() => handleDelete(r.id)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-sm hover:bg-red-100"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Usuń
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
