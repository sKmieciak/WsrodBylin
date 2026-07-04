import { useState, useEffect } from "react";

type Props = {
  label: string;
  value: number;
  onChange: (val: number) => void;
  required?: boolean;
  min?: number;
};

export default function NumberInput({ label, value, onChange, required, min = 0 }: Props) {
  const [raw, setRaw] = useState(value === 0 ? "" : String(value));

  useEffect(() => {
    setRaw(value === 0 ? "" : String(value));
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setRaw(val);
    const num = parseFloat(val);
    if (!isNaN(num) && num >= min) {
      onChange(num);
    }
  };

  const handleBlur = () => {
    const num = parseFloat(raw);
    if (isNaN(num) || num < min) {
      setRaw(String(min));
      onChange(min);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type="number"
        inputMode="decimal"
        value={raw}
        min={min}
        onChange={handleChange}
        onBlur={handleBlur}
        required={required}
        className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-green-300 focus:outline-none"
      />
    </div>
  );
}
