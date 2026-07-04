import FilterSection from "./FilterSection";

interface Props {
  onSearch: (query: string) => void;
}

export default function FilterSearch({ onSearch }: Props) {
  return (
    <FilterSection title="Szukaj">
      <input
        type="search"
        placeholder="np. jabłoń"
        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition"
        onChange={(e) => onSearch(e.target.value)}
      />
    </FilterSection>
  );
}
