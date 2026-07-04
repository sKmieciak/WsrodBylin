// src/api/order.ts
import axios from "../lib/axios";
import { API_URL } from "../data/Api_URL";

interface CreateOrderDto {
  courier: string;
  paymentMethod: string;
  deliveryCost: number;
  items: { productId: number; quantity: number }[];
  shippingFirstName: string;
  shippingLastName: string;
  shippingEmail: string;
  shippingPhone: string;
  shippingStreet: string;
  shippingHouseNumber: string;
  shippingPostalCode: string;
  shippingCity: string;
  shippingCountry: string;
  paczkomatPoint?: string;
}

export const createOrder = async (data: CreateOrderDto) => {
  const response = await axios.post(`${API_URL}api/order`, data);
  return response.data;
};

export const getAdminOrders = async (page = 1, pageSize = 50) => {
  const response = await axios.get(`${API_URL}api/order/admin?page=${page}&pageSize=${pageSize}`);
  return response.data;
};

export const updateOrderStatus = async (id: number, status: number) => {
  await axios.patch(`${API_URL}api/order/${id}/status`, { status });
};

export const updatePaymentStatus = async (id: number, paymentStatus: number) => {
  await axios.patch(`${API_URL}api/order/${id}/payment-status`, { paymentStatus });
};

export const deleteOrder = async (id: number) => {
  await axios.delete(`${API_URL}api/order/admin/${id}`);
};
