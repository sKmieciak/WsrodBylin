type Props = {
  label: string;
  value: number;
  onChange: (val: number) => void;
  options: { id: number; name: string }[];
  required?: boolean;
};

export default function SelectInput({ label, value, onChange, options, required }: Props) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        required={required}
        className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-green-300 focus:outline-none"
      >
        <option value="">Wybierz...</option>
        {options.map((opt) => (
          <option key={opt.id} value={opt.id}>
            {opt.name}
          </option>
        ))}
      </select>
    </div>
  );
}
