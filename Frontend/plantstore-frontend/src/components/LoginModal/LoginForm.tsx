import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import InputField from "./InputField";

const loginSchema = z.object({
  email: z.string().email("Niepoprawny email"),
  password: z.string().min(6, "Hasło musi mieć min. 6 znaków"),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface Props {
  onSwitch: () => void;
  onClose: () => void;
}

const LoginForm = ({ onSwitch, onClose }: Props) => {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    try {
      await login(data.email, data.password);
      onClose();
    } catch (err) {
      // Możesz tu rozbudować obsługę błędów globalnych
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h2 className="text-xl font-bold mb-4 text-center">Logowanie</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <InputField
          type="email"
          placeholder="Email"
          register={register("email")}
          error={errors.email?.message}
        />
        <InputField
          type="password"
          placeholder="Hasło"
          register={register("password")}
          error={errors.password?.message}
        />
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 flex items-center justify-center gap-2"
          disabled={loading}
        >
          {loading && (
            <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
            </svg>
          )}
          Zaloguj się
        </button>
      </form>
      <p className="mt-4 text-sm text-center">
        Nie masz konta?{" "}
        <button onClick={onSwitch} className="text-green-700 hover:underline font-medium">
          Zarejestruj się
        </button>
      </p>
    </>
  );
};

export default LoginForm;
