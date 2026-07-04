// ProfileForm.tsx
import { useEffect, useState } from "react";
import { useUser } from "../../hooks/useUser";

export default function ProfileForm() {
  const { user, update } = useUser();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    isCompanyAccount: false,
    street: "",
    houseNumber: "",
    postalCode: "",
    city: "",
    country: "Polska",
    addressAddon: ""
  });

  useEffect(() => {
    if (user) {
      setForm({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phoneNumber: user.phone || "",
        isCompanyAccount: user.isCompanyAccount || false,
        street: user.street || "",
        houseNumber: user.houseNumber || "",
        postalCode: user.postalCode || "",
        city: user.city || "",
        country: user.country || "Polska",
        addressAddon: user.addressAddon || ""
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setForm({
      ...form,
      [name]: type === "radio" ? value === "true" : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await update(form);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded border max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Moje dane</h2>

      <div className="mb-4 flex gap-6">
        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="isCompanyAccount"
            value="false"
            checked={!form.isCompanyAccount}
            onChange={handleChange}
          />
          Osoba prywatna
        </label>
        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="isCompanyAccount"
            value="true"
            checked={form.isCompanyAccount}
            onChange={handleChange}
          />
          Firma
        </label>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        <input name="firstName" placeholder="Imię" value={form.firstName} onChange={handleChange} className="border p-2 rounded" />
        <input name="street" placeholder="Ulica" value={form.street} onChange={handleChange} className="border p-2 rounded" />
        <input name="postalCode" placeholder="Kod pocztowy" value={form.postalCode} onChange={handleChange} className="border p-2 rounded" />

        <input name="lastName" placeholder="Nazwisko" value={form.lastName} onChange={handleChange} className="border p-2 rounded" />
        <input name="houseNumber" placeholder="Numer domu / mieszkania" value={form.houseNumber} onChange={handleChange} className="border p-2 rounded" />
        <input name="city" placeholder="Miejscowość" value={form.city} onChange={handleChange} className="border p-2 rounded" />

        <input name="email" placeholder="E-mail" value={form.email} onChange={handleChange} className="border p-2 rounded" />
        <select name="country" value={form.country} onChange={handleChange} className="border p-2 rounded">
          <option value="Polska">Polska</option>
          <option value="Niemcy">Niemcy</option>
          <option value="Czechy">Czechy</option>
        </select>
        <div>
          <input
            name="addressAddon"
            placeholder="Dodatek do adresu"
            value={form.addressAddon}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
          <p className="text-xs text-gray-500 mt-1">Opcjonalne</p>
        </div>

        <input name="phoneNumber" placeholder="Numer telefonu" value={form.phoneNumber} onChange={handleChange} className="border p-2 rounded col-span-2 sm:col-span-1" />
      </div>

      <div className="flex justify-between items-center mt-6">

        <button type="submit" className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600">
          Zapisz zmiany
        </button>
      </div>
    </form>
  );
}
