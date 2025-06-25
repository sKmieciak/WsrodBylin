import type { UseFormRegisterReturn } from "react-hook-form";
import ErrorMessage from "./ErrorMessage";

interface Props {
  type: string;
  placeholder: string;
  register: UseFormRegisterReturn;
  error?: string;
}

export default function InputField({ type, placeholder, register, error }: Props) {
  return (
    <div>
      <input
        type={type}
        placeholder={placeholder}
        {...register}
        className="w-full border border-gray-300 rounded px-4 py-2"
      />
      <ErrorMessage message={error || null} />
    </div>
  );
}
