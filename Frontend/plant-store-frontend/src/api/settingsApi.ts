import axios from "../lib/axios";

export type Settings = Record<string, string>;

export const getSettings = async (): Promise<Settings> => {
  const res = await axios.get("/api/settings");
  return res.data;
};

export const saveSettings = async (data: Settings): Promise<void> => {
  await axios.put("/api/settings", data);
};
