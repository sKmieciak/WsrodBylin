import { useNavigate, useLocation } from "react-router-dom";
import { CategoryBar } from "./CategoryBar";
import { useCategory } from "../../context/CategoryContext";

export const CategoryBarWrapper = () => {
  const { setSelectedCategory } = useCategory();
  const navigate = useNavigate();
  const location = useLocation();

  const hideBottomNav = ["/cart", "/checkout"].some(p => location.pathname.startsWith(p));

  const handleSelect = (category: string | null) => {
    setSelectedCategory(category);
    if (location.pathname !== "/products") {
      navigate("/products");
    }
  };

  return (
    <div className="bg-white shadow-sm">
      <CategoryBar onSelect={handleSelect} hideBottomNav={hideBottomNav} />
    </div>
  );
};
