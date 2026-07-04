import { useState } from "react";
import { changePassword } from "../../api/userApi";

export default function ChangePasswordForm() {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (form.newPassword !== form.confirmPassword) {
      setError("Nowe hasła nie są takie same.");
      return;
    }

    try {
      await changePassword({
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });
      setSuccess(true);
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err: any) {
      setError("Nie udało się zmienić hasła. Sprawdź obecne hasło.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg mx-auto mt-10">
      <h2 className="text-xl font-semibold">Zmiana hasła</h2>

      <input
        type="password"
        name="currentPassword"
        placeholder="Obecne hasło"
        className="w-full border p-2 rounded"
        value={form.currentPassword}
        onChange={handleChange}
        required
      />
      <input
        type="password"
        name="newPassword"
        placeholder="Nowe hasło"
        className="w-full border p-2 rounded"
        value={form.newPassword}
        onChange={handleChange}
        required
      />
      <input
        type="password"
        name="confirmPassword"
        placeholder="Powtórz nowe hasło"
        className="w-full border p-2 rounded"
        value={form.confirmPassword}
        onChange={handleChange}
        required
      />

      {error && <p className="text-red-600">{error}</p>}
      {success && <p className="text-green-600">Hasło zostało zmienione!</p>}

      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        Zmień hasło
      </button>
    </form>
  );
}
