import axios from "../../lib/axios";
import { API_URL } from "../../data/Api_URL";

export const fetchAdminProducts = async () => {
  const response = await axios.get(`${API_URL}api/products`);
  return response.data.items;
};

export const fetchCategories = async () => {
  const response = await axios.get(`${API_URL}api/categories`);
  return response.data;
};

// 🔄 Teraz dane muszą być przekazane jako FormData
export const createProduct = async (formData: FormData) => {
  const response = await axios.post(`${API_URL}api/products`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const updateProduct = async (id: number, formData: FormData) => {
  await axios.put(`${API_URL}api/products/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const deleteProduct = async (id: number) => {
  await axios.delete(`${API_URL}api/products/${id}`);
};
