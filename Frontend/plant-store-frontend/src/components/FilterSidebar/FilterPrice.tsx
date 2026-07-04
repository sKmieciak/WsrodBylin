import { useState, useEffect } from "react";
import FilterSection from "./FilterSection";

interface Props {
  onPriceChange: (min: number | null, max: number | null) => void;
}

export default function FilterPrice({ onPriceChange }: Props) {
  const [minPrice, setMinPrice] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);

  useEffect(() => {
    onPriceChange(minPrice, maxPrice);
  }, [minPrice, maxPrice]);

  return (
    <FilterSection title="Cena">
      <div className="flex items-center gap-2">
        <input
          type="number"
          min={0}
          placeholder="Od"
          value={minPrice ?? ""}
          onChange={(e) =>
            setMinPrice(e.target.value ? parseFloat(e.target.value) : null)
          }
          className="w-20 px-2 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-green-400 focus:outline-none"
        />
        <span className="text-gray-500">–</span>
        <input
          type="number"
          placeholder="Do"
          value={maxPrice ?? ""}
          onChange={(e) =>
            setMaxPrice(e.target.value ? parseFloat(e.target.value) : null)
          }
          className="w-20 px-2 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-green-400 focus:outline-none"
        />
      </div>
    </FilterSection>
  );
}
