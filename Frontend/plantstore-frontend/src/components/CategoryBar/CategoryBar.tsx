import { useState } from "react";
import CategoryItem from "./CategoryItem";

interface Props {
  onSelect: (category: string | null) => void;
}

const categories = [
  "Wszystkie",
  "Trawy ozdobne",
  "Byliny",
  "Nowości",
  "Promocje",
  "Aktualności",
  "Kontakt",
];

export const CategoryBar = ({ onSelect }: Props) => {
  const [active, setActive] = useState<string | null>(null);

  const handleClick = (cat: string) => {
    setActive(cat);
    onSelect(cat === "Wszystkie" ? null : cat);
  };

  return (
    <nav className="w-full border-b border-gray-200 py-3 mb-6">
      <ul className="flex justify-center gap-6 flex-wrap">
        {categories.map((cat) => (
          <li key={cat}>
            <CategoryItem
              label={cat}
              active={active === cat}
              onClick={() => handleClick(cat)}
            />
          </li>
        ))}
      </ul>
    </nav>
  );
};
