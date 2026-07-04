interface InputProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  required?: boolean;
}

export function Input({ label, name, value, onChange, type = "text", required }: InputProps) {
  return (
    <label className="block text-sm">
      <span className="text-sm">{label}</span>
      <input
        name={name}
        value={value}
        type={type}
        required={required}
        onChange={onChange}
        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
      />
    </label>
  );
}
