import { useState } from "react";
import CategoryItem from "./CategoryItem";
import CategoryItemMobile from "./CategoryItemMobile";
import { categoryIcons } from "./CategoryIcons"; // ⬅️ dodaj to
import { useNavigate } from "react-router-dom";

interface Props {
  onSelect: (category: string | null) => void;
  hideBottomNav?: boolean;
}

const categories = [
  "Wszystkie",
  "Trawy ozdobne",
  "Byliny",
  "Promocje",
  "Kontakt",
];

export const CategoryBar = ({ onSelect, hideBottomNav = false }: Props) => {
  const [active, setActive] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleClick = (cat: string) => {
    if (cat === "Kontakt") {
      setActive(cat);
      navigate("/kontakt");
      return;
    }
    if(cat === "Promocje") {
      setActive(cat);
      navigate("/promocje");
      return;
    }

    setActive(cat);
    onSelect(cat === "Wszystkie" ? null : cat);
  };

  return (
    <>
      {/* Desktop */}
      <nav className="hidden md:block w-full border-b border-gray-200 py-3 mb-6">
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

      {/* Mobile */}
      <nav className={`md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-md px-2 py-2${hideBottomNav ? " hidden" : ""}`}>
        <ul className="flex justify-center gap-4 px-1">
          {categories.map((cat) => (
            <li key={cat}>
              <CategoryItemMobile
                label={cat}
                icon={categoryIcons[cat]}
                active={active === cat}
                onClick={() => handleClick(cat)}
              />
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
};
