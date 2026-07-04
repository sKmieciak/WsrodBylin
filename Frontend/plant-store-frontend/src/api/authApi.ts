import axios from '../lib/axios';
import { API_URL } from '../data/Api_URL';

export const loginUser = async (email: string, password: string) => {
  const response = await axios.post(`${API_URL}user/login`, {
    email,
    password,
  });
  return response.data;
};

export const getMe = async () => {
  const response = await axios.get(`${API_URL}user/me`);
  return response.data;
};
