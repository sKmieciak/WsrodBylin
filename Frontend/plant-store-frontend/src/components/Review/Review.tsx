interface Props {
  author: string;
  content: string;
  rating: number;
  createdAt?: string;
}

export default function Review({ author, content, rating, createdAt }: Props) {
  return (
    <div className="bg-white border rounded-xl p-4 shadow-sm space-y-2">
      <div className="flex justify-between items-center">
        <div className="text-sm font-semibold text-gray-800">{author}</div>
        <div className="text-sm text-yellow-500 font-medium">
          {Array.from({ length: 5 }, (_, i) => (
            <span key={i}>{i < rating ? "★" : "☆"}</span>
          ))}
        </div>
      </div>

      <p className="text-gray-700 text-sm">{content}</p>

      {createdAt && (
        <p className="text-xs text-gray-400">
          {new Date(createdAt).toLocaleDateString("pl-PL")}
        </p>
      )}
    </div>
  );
}
