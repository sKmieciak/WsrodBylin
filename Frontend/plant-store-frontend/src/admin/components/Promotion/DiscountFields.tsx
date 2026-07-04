interface Props {
  percentage: number;
  value: number;
  onPercentageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onValueChange: (val: number) => void;
}

export default function DiscountFields({
  percentage,
  value,
  onPercentageChange,
  onValueChange,
}: Props) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-sm mb-1">Zniżka %</label>
        <input
          type="number"
          name="discountPercentage"
          value={percentage}
          onChange={onPercentageChange}
          min={1}
          max={100}
          required
          className="w-full border rounded px-3 py-2"
        />
      </div>
      <div>
        <label className="block text-sm mb-1">Zniżka w zł</label>
        <input
          type="number"
          value={value}
          onChange={(e) => onValueChange(parseFloat(e.target.value))}
          min={0}
          step={0.01}
          className="w-full border rounded px-3 py-2"
        />
      </div>
    </div>
  );
}
