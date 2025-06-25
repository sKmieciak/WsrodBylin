interface Props {
  address: string;
  onDelete: () => void;
}

export default function AddressCard({ address, onDelete }: Props) {
  return (
    <div className="border p-4 rounded shadow-sm flex justify-between items-center">
      <span>{address}</span>
      <button
        onClick={onDelete}
        className="text-sm text-red-600 hover:underline"
      >
        Usuń
      </button>
    </div>
  );
}
