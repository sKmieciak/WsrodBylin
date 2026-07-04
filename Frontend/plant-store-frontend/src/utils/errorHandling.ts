import axios from "axios";

export function getApiErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;
    if (typeof data === "string" && data.trim()) return data;
    return (
      data?.message ??
      data?.error ??
      data?.title ??
      `Błąd ${error.response?.status ?? "sieci"}.`
    );
  }
  if (error instanceof Error) return error.message;
  return "Wystąpił nieoczekiwany błąd.";
}
