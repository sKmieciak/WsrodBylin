// src/utils/getTokenData.ts
import { decodeJwt } from "jose";

export function getTokenData() {
  const authDataRaw = localStorage.getItem("auth"); // 👈 np. auth
  if (!authDataRaw) return null;

  try {
    const authData = JSON.parse(authDataRaw);
    const token = authData.token;
    const decoded: any = decodeJwt(token);
    return {
      id: decoded?.sub,
      email: decoded?.email,
      name: decoded?.name,
      isAdmin: decoded?.IsAdmin === "True" || decoded?.IsAdmin === true,
    };
  } catch (e) {
    console.error("Token decode failed:", e);
    return null;
  }
}
