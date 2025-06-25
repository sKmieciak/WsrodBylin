import axios from "../lib/axios";

import type { UpdateUserDto, ChangePasswordDto } from "../types/User";

export const getMe = async () => {
  const response = await axios.get("/api/user/me");
  return response.data;
};

export const updateUser = async (data: UpdateUserDto): Promise<void> => {
  await axios.put("/api/user", data);
};

export const changePassword = async (data: ChangePasswordDto): Promise<void> => {
  await axios.put("/api/user/change-password", data);
};
