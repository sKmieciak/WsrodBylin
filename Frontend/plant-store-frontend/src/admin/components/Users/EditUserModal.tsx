import type { UpdateUserDto } from "../../../types/User";

interface Props {
  form: UpdateUserDto;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCancel: () => void;
  onSave: () => void;
}

export default function EditUserModal({ form, onChange, onCancel, onSave }: Props) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white p-6 rounded shadow-xl w-full max-w-2xl">
        <h2 className="text-xl font-semibold mb-4">Edycja użytkownika</h2>
        <div className="grid grid-cols-2 gap-4">
          <input type="text" name="firstName" value={form.firstName} onChange={onChange} placeholder="Imię" className="border p-2 rounded" />
          <input type="text" name="lastName" value={form.lastName} onChange={onChange} placeholder="Nazwisko" className="border p-2 rounded" />
          <input type="text" name="email" value={form.email} onChange={onChange} placeholder="Email" className="border p-2 rounded" />
          <input type="text" name="phoneNumber" value={form.phoneNumber} onChange={onChange} placeholder="Telefon" className="border p-2 rounded" />
          <input type="text" name="street" value={form.street} onChange={onChange} placeholder="Ulica" className="border p-2 rounded" />
          <input type="text" name="houseNumber" value={form.houseNumber} onChange={onChange} placeholder="Nr domu" className="border p-2 rounded" />
          <input type="text" name="postalCode" value={form.postalCode} onChange={onChange} placeholder="Kod pocztowy" className="border p-2 rounded" />
          <input type="text" name="city" value={form.city} onChange={onChange} placeholder="Miasto" className="border p-2 rounded" />
          <input type="text" name="country" value={form.country} onChange={onChange} placeholder="Kraj" className="border p-2 rounded" />
          <input type="text" name="addressAddon" value={form.addressAddon} onChange={onChange} placeholder="Dodatek do adresu" className="border p-2 rounded col-span-2" />
        </div>
        <div className="flex justify-end gap-4 mt-6">
          <button onClick={onCancel} className="px-4 py-2 border rounded">Anuluj</button>
          <button onClick={onSave} className="px-4 py-2 bg-green-600 text-white rounded">Zapisz zmiany</button>
        </div>
      </div>
    </div>
  );
}
