type Props = {
  label: string;
  value: number;
  onChange: (val: number) => void;
  required?: boolean;
};

export default function NumberInput({ label, value, onChange, required }: Props) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        required={required}
        className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-green-300 focus:outline-none"
      />
    </div>
  );
}
