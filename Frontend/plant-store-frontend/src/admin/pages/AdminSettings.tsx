import { useEffect, useState } from "react";
import { getSettings, saveSettings } from "../../api/settingsApi";

const BANK_FIELDS = [
  { key: "bankRecipient", label: "Odbiorca przelewu", placeholder: "Justyna Tracz" },
  { key: "bankAccountNumber", label: "Numer konta", placeholder: "PL00 0000 0000 0000 0000 0000 0000" },
  { key: "bankName", label: "Nazwa banku", placeholder: "PKO Bank Polski" },
  { key: "bankTransferTitle", label: "Tytuł przelewu (przelew tradycyjny)", placeholder: "Zamówienie #{id}" },
];

const BLIK_FIELDS = [
  { key: "blikPhoneNumber", label: "Numer telefonu do BLIK", placeholder: "+48 000 000 000" },
  { key: "blikTransferTitle", label: "Tytuł przelewu (BLIK)", placeholder: "Zamówienie #{id}" },
];

export default function AdminSettings() {
  const [form, setForm] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getSettings().then((data) => {
      setForm(data);
      setLoading(false);
    });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    await saveSettings(form);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (loading) return <div className="text-gray-500 py-10 text-center">Ładowanie...</div>;

  return (
    <div className="max-w-xl">
      <h2 className="text-2xl font-bold mb-6">Ustawienia sklepu</h2>

      <div className="bg-white border rounded-xl p-6 space-y-4">
        <h3 className="font-semibold text-gray-700 text-lg">Przelew tradycyjny</h3>
        <p className="text-sm text-gray-500">
          Te dane wyświetlają się gdy klient wybierze przelew tradycyjny.
          W tytule użyj <code className="bg-gray-100 px-1 rounded">{"#{id}"}</code> — zostanie zastąpione numerem zamówienia.
        </p>
        {BANK_FIELDS.map(({ key, label, placeholder }) => (
          <div key={key}>
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            <input
              type="text"
              value={form[key] ?? ""}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              placeholder={placeholder}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        ))}
      </div>

      <div className="bg-white border rounded-xl p-6 space-y-4">
        <h3 className="font-semibold text-gray-700 text-lg">Przelew na telefon (BLIK)</h3>
        <p className="text-sm text-gray-500">
          Te dane wyświetlają się gdy klient wybierze przelew na telefon (BLIK).
          W tytule użyj <code className="bg-gray-100 px-1 rounded">{"#{id}"}</code> — zostanie zastąpione numerem zamówienia.
        </p>
        {BLIK_FIELDS.map(({ key, label, placeholder }) => (
          <div key={key}>
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            <input
              type="text"
              value={form[key] ?? ""}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              placeholder={placeholder}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        ))}
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium disabled:opacity-60"
      >
        {saved ? "Zapisano!" : saving ? "Zapisywanie..." : "Zapisz"}
      </button>
    </div>
  );
}
