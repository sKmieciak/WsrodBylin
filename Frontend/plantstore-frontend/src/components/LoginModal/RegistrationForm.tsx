import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Input } from "./Input";
import { GridTwo } from "./GridTwo";

interface Props {
  onSwitch: () => void;
  onClose: () => void;
}

export default function RegistrationForm({ onSwitch, onClose }: Props) {
  const { register } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    street: "",
    houseNumber: "",
    postalCode: "",
    city: "",
    country: "Polska",
    addressAddon: "",
    isCompanyAccount: false,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type, checked } = target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    try {
      await register(
        form.email,
        form.password,
        form.firstName,
        form.lastName,
        form.phoneNumber,
        form.street,
        form.houseNumber,
        form.postalCode,
        form.city,
        form.country,
        form.addressAddon,
        form.isCompanyAccount
      );
      setSuccess(true);
      onClose();
    } catch (err) {
      setError("Rejestracja nie powiodła się.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full">
      <h2 className="text-xl font-semibold text-gray-800 text-center">
        Załóż konto
      </h2>

      {/* Email i hasło */}
      <div className="space-y-2">
        <Input
          label="Adres e-mail"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <Input
          label="Hasło"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          required
        />
      </div>

      {/* Imię i nazwisko */}
      <GridTwo>
        <Input
          label="Imię"
          name="firstName"
          value={form.firstName}
          onChange={handleChange}
          required
        />
        <Input
          label="Nazwisko"
          name="lastName"
          value={form.lastName}
          onChange={handleChange}
          required
        />
      </GridTwo>

      {/* Telefon */}
      <Input
        label="Numer telefonu"
        name="phoneNumber"
        value={form.phoneNumber}
        onChange={handleChange}
      />

      {/* Ulica i nr domu */}
      <GridTwo>
        <Input
          label="Ulica"
          name="street"
          value={form.street}
          onChange={handleChange}
          required
        />
        <Input
          label="Nr domu"
          name="houseNumber"
          value={form.houseNumber}
          onChange={handleChange}
          required
        />
      </GridTwo>

      {/* Kod pocztowy i miasto */}
      <GridTwo>
        <Input
          label="Kod pocztowy"
          name="postalCode"
          value={form.postalCode}
          onChange={handleChange}
          required
        />
        <Input
          label="Miasto"
          name="city"
          value={form.city}
          onChange={handleChange}
          required
        />
      </GridTwo>

      {/* Kraj i dodatek do adresu */}
      <Input
        label="Kraj"
        name="country"
        value={form.country}
        onChange={handleChange}
        required
      />
      <Input
        label="Dodatek do adresu (opcjonalnie)"
        name="addressAddon"
        value={form.addressAddon}
        onChange={handleChange}
      />

      {/* Konto firmowe */}
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          name="isCompanyAccount"
          checked={form.isCompanyAccount}
          onChange={handleChange}
        />
        Konto firmowe
      </label>

      {/* Błędy / komunikaty */}
      {error && <p className="text-red-600 text-sm">{error}</p>}
      {success && (
        <p className="text-green-600 text-sm">Rejestracja udana 🎉</p>
      )}

      {/* Przycisk */}
      <button
        type="submit"
        disabled={loading}
        className="bg-green-600 text-white w-full py-2 rounded hover:bg-green-700">
        {loading ? "Rejestruję..." : "Zarejestruj się"}
      </button>

      <p className="mt-4 text-sm text-center">
        Masz już konto?{" "}
        <button
          type="button"
          onClick={onSwitch}
          className="text-green-700 hover:underline font-medium">
          Zaloguj się
        </button>
      </p>
    </form>
  );
}
