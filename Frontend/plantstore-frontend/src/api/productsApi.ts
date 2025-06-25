import axios from "axios";
import type { Product } from "../types/Product";
import { API_URL } from "../data/Api_URL";

interface ProductPage {
  items: Product[];
  totalItems: number;
  currentPage: number;
  totalPages: number;
}

export const getProducts = async (): Promise<Product[]> => {
  const response = await axios.get<ProductPage>(`${API_URL}api/products`);
  return response.data.items;
};

export const getProductById = async (id: number): Promise<Product> => {
  const response = await axios.get(`${API_URL}api/products/${id}`);
  return response.data;
};
