import axios from "axios";

export function getApiErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    return (
      error.response?.data?.message ??
      error.response?.data?.error ??
      `Błąd ${error.response?.status ?? "sieci"}.`
    );
  }
  if (error instanceof Error) return error.message;
  return "Wystąpił nieoczekiwany błąd.";
}
