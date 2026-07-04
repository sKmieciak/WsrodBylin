interface Props {
  message: string | null;
}

export default function ErrorMessage({ message }: Props) {
  if (!message) return null;
  return <p className="text-red-600 text-sm mt-1 text-center">{message}</p>;
}
