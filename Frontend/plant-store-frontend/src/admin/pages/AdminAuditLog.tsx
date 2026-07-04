import { useEffect, useState } from "react";
import axios from "../../lib/axios";
import { API_URL } from "../../data/Api_URL";

interface AuditEntry {
  id: number;
  createdAt: string;
  adminEmail: string;
  adminName: string;
  action: string;
  entityType: string;
  entityId: number | null;
  details: string;
}

const ACTION_COLORS: Record<string, string> = {
  "Dodano":           "bg-green-100 text-green-800",
  "Edytowano":        "bg-blue-100 text-blue-800",
  "Usunięto":         "bg-red-100 text-red-800",
  "Zatwierdzono":     "bg-green-100 text-green-800",
  "Ukryto":           "bg-gray-100 text-gray-700",
  "Zmiana statusu":   "bg-yellow-100 text-yellow-800",
  "Zmiana płatności": "bg-purple-100 text-purple-800",
};

export default function AdminAuditLog() {
  const [logs, setLogs] = useState<AuditEntry[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const pageSize = 50;

  useEffect(() => {
    setLoading(true);
    axios.get(`${API_URL}api/audit?page=${page}&pageSize=${pageSize}`)
      .then(r => { setLogs(r.data.data); setTotal(r.data.total); })
      .finally(() => setLoading(false));
  }, [page]);

  const pages = Math.ceil(total / pageSize);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Logi aktywności ({total})</h1>

      {loading ? (
        <p className="text-gray-500">Ładowanie...</p>
      ) : logs.length === 0 ? (
        <p className="text-gray-400">Brak wpisów.</p>
      ) : (
        <>
          <div className="overflow-x-auto rounded-xl border bg-white shadow-sm">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                <tr>
                  <th className="px-4 py-3 text-left">Data</th>
                  <th className="px-4 py-3 text-left">Admin</th>
                  <th className="px-4 py-3 text-left">Akcja</th>
                  <th className="px-4 py-3 text-left">Obiekt</th>
                  <th className="px-4 py-3 text-left">Szczegóły</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {logs.map(log => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2.5 whitespace-nowrap text-gray-500">
                      {new Date(log.createdAt).toLocaleString("pl-PL")}
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="font-medium text-gray-800">{log.adminName}</div>
                      <div className="text-xs text-gray-400">{log.adminEmail}</div>
                    </td>
                    <td className="px-4 py-2.5">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${ACTION_COLORS[log.action] ?? "bg-gray-100 text-gray-700"}`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="px-4 py-2.5">
                      <span className="text-gray-700">{log.entityType}</span>
                      {log.entityId && <span className="text-gray-400 ml-1">#{log.entityId}</span>}
                    </td>
                    <td className="px-4 py-2.5 text-gray-600">{log.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {pages > 1 && (
            <div className="flex gap-2 mt-4 justify-center">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="px-3 py-1 border rounded text-sm disabled:opacity-40">
                ‹ Poprzednia
              </button>
              <span className="px-3 py-1 text-sm text-gray-600">{page} / {pages}</span>
              <button onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page === pages}
                className="px-3 py-1 border rounded text-sm disabled:opacity-40">
                Następna ›
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
