import { useEffect, useState } from "react";
import axios from "../lib/axios";
import { API_URL } from "../data/Api_URL";

type Status = "unsupported" | "denied" | "subscribed" | "unsubscribed" | "loading";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
}

const isIos = () => /iphone|ipad|ipod/i.test(navigator.userAgent);
const isInStandaloneMode = () =>
  "standalone" in window.navigator && (window.navigator as any).standalone === true;

export function usePushNotifications() {
  const [status, setStatus] = useState<Status>("loading");
  const [, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      setStatus("unsupported");
      return;
    }
    checkStatus();
  }, []);

  const checkStatus = async () => {
    if (Notification.permission === "denied") { setStatus("denied"); return; }
    const reg = await navigator.serviceWorker.getRegistration("/sw.js");
    if (!reg) { setStatus("unsubscribed"); return; }
    const sub = await reg.pushManager.getSubscription();
    setStatus(sub ? "subscribed" : "unsubscribed");
  };

  const subscribe = async () => {
    setError(null);

    // iOS wymaga trybu standalone (dodanie do ekranu głównego)
    if (isIos() && !isInStandaloneMode()) {
      setError("ios-standalone");
      return;
    }

    setStatus("loading");
    try {
      const reg = await navigator.serviceWorker.register("/sw.js");
      await navigator.serviceWorker.ready;

      const { data } = await axios.get(`${API_URL}api/push/vapid-public-key`);
      const applicationServerKey = urlBase64ToUint8Array(data.publicKey);

      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey,
      });

      const json = sub.toJSON();
      await axios.post(`${API_URL}api/push/subscribe`, {
        endpoint: json.endpoint,
        p256DH: json.keys?.p256dh,
        auth: json.keys?.auth,
      });

      setStatus("subscribed");
    } catch (e: any) {
      setStatus("unsubscribed");
      setError(e?.message ?? "Błąd włączania powiadomień");
    }
  };

  const unsubscribe = async () => {
    setStatus("loading");
    setError(null);
    try {
      const reg = await navigator.serviceWorker.getRegistration("/sw.js");
      const sub = await reg?.pushManager.getSubscription();
      if (sub) {
        await axios.delete(`${API_URL}api/push/unsubscribe`, { data: { endpoint: sub.endpoint } });
        await sub.unsubscribe();
      }
      setStatus("unsubscribed");
    } catch {
      setStatus("subscribed");
    }
  };

  return { status, subscribe, unsubscribe };
}
