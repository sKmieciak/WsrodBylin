import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
type CategoryContextType = {
  selectedCategory: string | null;
  setSelectedCategory: (cat: string | null) => void;
};

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

export const CategoryProvider = ({ children }: { children: ReactNode }) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  return (
    <CategoryContext.Provider value={{ selectedCategory, setSelectedCategory }}>
      {children}
    </CategoryContext.Provider>
  );
};

export const useCategory = () => {
  const context = useContext(CategoryContext);
  if (!context) throw new Error("useCategory must be used inside CategoryProvider");
  return context;
};
