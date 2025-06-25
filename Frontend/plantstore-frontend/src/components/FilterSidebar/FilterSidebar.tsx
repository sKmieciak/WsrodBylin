import FilterSearch from "./FilterSearch";
import FilterPrice from "./FilterPrice";
import FilterAvailability from "./FilterAvailability";

interface Props {
  onSearch: (query: string) => void;
  onPriceChange: (min: number | null, max: number | null) => void;
}

export const FilterSidebar = ({ onSearch, onPriceChange }: Props) => {
  return (
    <aside className="hidden lg:block bg-gray-50 border border-gray-200 rounded-xl p-4 h-fit">
      <h2 className="text-lg font-semibold mb-4">Filtry</h2>
      <FilterSearch onSearch={onSearch} />
      <FilterPrice onPriceChange={onPriceChange} />
      <FilterAvailability />
    </aside>
  );
};
