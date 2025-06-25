// src/api/order.ts
import axios from "../lib/axios";
import { API_URL } from "../data/Api_URL";
import type { CartItem } from "../types/CartItem";

interface CreateOrderDto {
  courier: string;
  paymentMethod: string;
  items: {
    productId: number;
    quantity: number;
  }[];
}

export const createOrder = async (data: CreateOrderDto) => {
  const response = await axios.post(`${API_URL}order`, data);
  return response.data;
};

export const createStripeSession = async (items: CartItem[]) => {
  const response = await axios.post(`${API_URL}payments/create-checkout-session`, {
    items: items.map((item) => ({
      productName: item.productName,
      price: item.productPrice,
      quantity: item.quantity,
    })),
  });
  return response.data;
};
