import { useEffect, useState } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { CheckCircle, Copy } from "lucide-react";
import { getSettings, type Settings } from "../../api/settingsApi";

function CopyRow({ label, value, accent }: { label: string; value: string; accent: string }) {
  const copy = () => navigator.clipboard.writeText(value);
  return (
    <div className="flex items-center justify-between gap-2">
      <div>
        <div className="text-xs text-gray-500">{label}</div>
        <div className="font-medium text-gray-800">{value}</div>
      </div>
      <button onClick={copy} title="Kopiuj" className={`p-1.5 rounded ${accent} flex-shrink-0`}>
        <Copy className="w-4 h-4" />
      </button>
    </div>
  );
}

export default function OrderSuccessPage() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const state = location.state as { paymentMethod?: string; total?: number } | null;
  const paymentMethod = state?.paymentMethod ?? "";
  const total = state?.total;
  const [settings, setSettings] = useState<Settings>({});

  useEffect(() => { getSettings().then(setSettings); }, []);

  const isBlik = paymentMethod.toLowerCase().includes("telefon") || paymentMethod.toLowerCase().includes("blik");
  const isTraditional = paymentMethod.toLowerCase().includes("przelew") && !isBlik;

  const bankTitle = (settings.bankTransferTitle ?? "Zamówienie #{id}").replace("{id}", id ?? "");
  const blikTitle = (settings.blikTransferTitle ?? "Zamówienie #{id}").replace("{id}", id ?? "");

  return (
    <div className="max-w-xl mx-auto px-4 py-16 text-center">
      <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
      <h1 className="text-3xl font-bold mb-2">Zamówienie złożone!</h1>
      <p className="text-gray-600 mb-8">
        Twoje zamówienie <span className="font-semibold">#{id}</span> zostało przyjęte. Dziękujemy!
      </p>

      {isTraditional && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-left mb-8 space-y-3">
          <h2 className="font-semibold text-green-800 text-lg">Dane do przelewu tradycyjnego</h2>
          <p className="text-sm text-gray-600">Prosimy o dokonanie wpłaty w ciągu 3 dni roboczych.</p>
          {settings.bankAccountNumber ? (
            [
              { label: "Odbiorca", value: settings.bankRecipient },
              { label: "Numer konta", value: settings.bankAccountNumber },
              { label: "Nazwa banku", value: settings.bankName },
              { label: "Tytuł przelewu", value: bankTitle },
            ].map(({ label, value }) =>
              value ? <CopyRow key={label} label={label} value={value} accent="hover:bg-green-100 text-green-700" /> : null
            )
          ) : (
            <p className="text-sm text-gray-500">Skontaktuj się ze sprzedawcą w celu uzyskania danych do przelewu.</p>
          )}
        </div>
      )}

      {isBlik && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-left mb-8 space-y-3">
          <h2 className="font-semibold text-blue-800 text-lg">Dane do przelewu na telefon (BLIK)</h2>
          <p className="text-sm text-gray-600">Prosimy o dokonanie wpłaty w ciągu 3 dni roboczych.</p>
          {settings.blikPhoneNumber ? (
            [
              { label: "Numer telefonu", value: settings.blikPhoneNumber },
              ...(total != null ? [{ label: "Kwota", value: `${total.toFixed(2)} zł` }] : []),
              { label: "Tytuł przelewu", value: blikTitle },
            ].map(({ label, value }) =>
              value ? <CopyRow key={label} label={label} value={value} accent="hover:bg-blue-100 text-blue-700" /> : null
            )
          ) : (
            <p className="text-sm text-gray-500">Skontaktuj się ze sprzedawcą w celu uzyskania numeru telefonu do BLIK.</p>
          )}
        </div>
      )}

      <Link
        to="/"
        className="inline-block px-6 py-3 bg-green-600 text-white rounded-xl text-lg hover:bg-green-700 transition"
      >
        Wróć do sklepu
      </Link>
    </div>
  );
}
