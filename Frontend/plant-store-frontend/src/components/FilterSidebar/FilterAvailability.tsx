import FilterSection from "./FilterSection";

export default function FilterAvailability() {
  return (
    <FilterSection title="Dostępność">
      <label className="flex items-center gap-2 text-sm text-gray-700">
        <input type="checkbox" />
        Tylko dostępne
      </label>
    </FilterSection>
  );
}
