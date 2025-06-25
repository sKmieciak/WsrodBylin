interface ProductImageProps {
  imageUrl: string;
  name: string;
}

export default function ProductImage({ imageUrl, name }: ProductImageProps) {
  return (
    <div className="flex justify-center items-start">
      <img
        src={imageUrl}
        alt={name}
        className="w-full max-w-md rounded-lg border"
      />
    </div>
  );
}
