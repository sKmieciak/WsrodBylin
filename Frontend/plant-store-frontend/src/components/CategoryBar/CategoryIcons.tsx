import type { JSX } from "react";
import {
  Leaf,
  Flower,
  Percent,
  Phone,
  Circle,
} from "lucide-react";

export const categoryIcons: Record<string, JSX.Element> = {
  Wszystkie: <Circle size={20} />,
  "Trawy ozdobne": <Leaf size={20} />,
  Byliny: <Flower size={20} />,
  Promocje: <Percent size={20} />,
  Kontakt: <Phone size={20} />,
};
