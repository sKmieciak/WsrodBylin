import { useState } from "react";
import LoginForm from "./LoginForm";
import RegistrationForm from "./RegistrationForm";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal = ({ isOpen, onClose }: Props) => {
  const [isRegister, setIsRegister] = useState(false);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}>
      <div
        className="bg-white rounded-xl shadow-lg w-[95%] max-w-md p-4 sm:p-6 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}>
        {isRegister ? (
          <RegistrationForm
            onSwitch={() => setIsRegister(false)}
            onClose={onClose}
          />
        ) : (
          <LoginForm onSwitch={() => setIsRegister(true)} onClose={onClose} />
        )}
      </div>
    </div>
  );
};

export default LoginModal;
