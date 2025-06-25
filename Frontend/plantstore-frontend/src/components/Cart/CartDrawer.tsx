import { useCart } from "../../hooks/useCart";
import CartDrawerHeader from "./CartDrawerHeader";
import CartDrawerItemList from "./CartDrawerItemList";
import CartDrawerFooter from "./CartDrawerFooter";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { cart, updateItem, removeItem } = useCart();

  const total = cart.reduce(
    (sum, item) => sum + item.productPrice * item.quantity,
    0
  );

  return (
    <div
      className={`fixed top-0 right-0 h-full w-full sm:w-[440px] bg-white shadow-2xl z-50 transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <CartDrawerHeader onClose={onClose} />
      <CartDrawerItemList cart={cart} updateItem={updateItem} removeItem={removeItem} />
      <CartDrawerFooter total={total} onClose={onClose} />
    </div>
  );
}
