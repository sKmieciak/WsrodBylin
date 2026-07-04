
interface Props {
  authorName: string;
  setAuthorName: (val: string) => void;
  email: string;
  setEmail: (val: string) => void;
  content: string;
  setContent: (val: string) => void;
  rating: number;
  setRating: (val: number) => void;
}

export function ReviewFormFields({
  authorName,
  setAuthorName,
  email,
  setEmail,
  content,
  setContent,
  rating,
  setRating,
}: Props) {
  return (
    <>
      <input
        className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
        placeholder="Twoje imię"
        value={authorName}
        onChange={(e) => setAuthorName(e.target.value)}
        required
      />
      <input
        type="email"
        className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
        placeholder="Twój email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <textarea
        className="w-full border border-gray-300 px-4 py-2 rounded-md min-h-[100px] focus:outline-none focus:ring-2 focus:ring-emerald-500"
        placeholder="Treść opinii"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
      />
      <div>
        <p className="text-sm mb-1">Twoja ocena:</p>
        <div className="flex space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className={star <= rating ? "text-yellow-400" : "text-gray-300"}
            >
              ★
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
