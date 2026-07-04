interface AddressData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  street: string;
  houseNumber: string;
  postalCode: string;
  city: string;
  country: string;
  addressAddon: string;
}

interface Props {
  data: AddressData;
  onChange: (data: AddressData) => void;
}

const Field = ({
  label,
  name,
  value,
  onChange,
  required,
  type = "text",
}: {
  label: string;
  name: keyof AddressData;
  value: string;
  onChange: (name: keyof AddressData, value: string) => void;
  required?: boolean;
  type?: string;
}) => (
  <div className="flex flex-col gap-1">
    <label className="text-sm font-medium text-gray-700">
      {label}{required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(name, e.target.value)}
      required={required}
      className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
    />
  </div>
);

export default function CheckoutAddressForm({ data, onChange }: Props) {
  const set = (name: keyof AddressData, value: string) =>
    onChange({ ...data, [name]: value });

  return (
    <div className="bg-white border rounded-xl shadow p-6 mb-8">
      <h2 className="text-lg font-semibold mb-5">Dane dostawy</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Imię" name="firstName" value={data.firstName} onChange={set} required />
        <Field label="Nazwisko" name="lastName" value={data.lastName} onChange={set} required />
        <Field label="E-mail" name="email" value={data.email} onChange={set} required type="email" />
        <Field label="Telefon" name="phoneNumber" value={data.phoneNumber} onChange={set} required type="tel" />
        <Field label="Ulica" name="street" value={data.street} onChange={set} required />
        <Field label="Nr domu / mieszkania" name="houseNumber" value={data.houseNumber} onChange={set} required />
        <Field label="Kod pocztowy" name="postalCode" value={data.postalCode} onChange={set} required />
        <Field label="Miasto" name="city" value={data.city} onChange={set} required />
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Kraj</label>
          <select
            value={data.country}
            onChange={(e) => set("country", e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="Polska">Polska</option>
            <option value="Niemcy">Niemcy</option>
            <option value="Czechy">Czechy</option>
          </select>
        </div>
        <Field label="Dodatek do adresu (opcjonalnie)" name="addressAddon" value={data.addressAddon} onChange={set} />
      </div>
    </div>
  );
}

export type { AddressData };
