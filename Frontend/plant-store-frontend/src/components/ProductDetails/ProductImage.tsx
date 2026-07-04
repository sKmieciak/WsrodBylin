import { useState } from "react";
import { API_URL } from "../../data/Api_URL";

interface ProductImageProps {
  imageUrls?: string[];
  name: string;
  defaultImageUrl?: string;
}

const getImageUrl = (path: string) => {
  if (!path) return "/images/placeholder.svg";
  if (path.startsWith("http")) return path;
  return path.startsWith("/") ? `${API_URL}${path}` : `${API_URL}/${path}`;
};


export default function ProductImage({
  imageUrls = [],
  name,
  defaultImageUrl,
}: ProductImageProps) {
  const uniqueUrls = [
    ...(defaultImageUrl ? [defaultImageUrl] : []),
    ...imageUrls.filter((url) => url !== defaultImageUrl),
  ];
  const [selected, setSelected] = useState(0);

  if (!uniqueUrls.length) {
    return (
      <div className="w-full border rounded-xl overflow-hidden mb-4">
        <img src="/images/placeholder.svg" alt={name} className="w-full h-64 object-contain" />
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Główne zdjęcie */}
      <div className="border rounded-xl overflow-hidden mb-4">
        <img
          src={getImageUrl(uniqueUrls[selected])}
          alt={`${name} - ${selected + 1}`}
          onError={(e) => { e.currentTarget.src = "/images/placeholder.svg"; }}
          className="w-full h-auto object-contain max-h-[500px] mx-auto"
        />
      </div>

      {/* Miniatury */}
      {uniqueUrls.length > 1 && (
        <div className="flex gap-2 overflow-x-auto">
          {uniqueUrls.map((url, index) => (
            <img
              key={index}
              src={getImageUrl(url)}
              alt={`${name} ${index + 1}`}
              onError={(e) => { e.currentTarget.src = "/images/placeholder.svg"; }}
              className={`w-20 h-20 object-cover rounded-lg cursor-pointer border ${
                selected === index ? "border-green-600" : "border-gray-300"
              }`}
              onClick={() => setSelected(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
