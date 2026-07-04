import axios from "../lib/axios";
import { API_URL } from "../data/Api_URL";

const API_URL_cart = `${API_URL}api/cart`;

export interface CartItemDto {
  id: number;
  productId: number;
  productName: string;
  productImage: string;
  productPrice: number;
  quantity: number;
  inStock?: number;
}

export interface CartItemCreateDto {
  productId: number;
  quantity: number;
}

export interface CartItemUpdateDto {
  quantity: number;
}

export async function getCart(): Promise<CartItemDto[]> {
  const response = await axios.get(API_URL_cart);
  return response.data;
}

export async function addToCart(item: CartItemCreateDto): Promise<void> {
  await axios.post(API_URL_cart, item);
}

export async function updateCartItem(productId: number, quantity: number): Promise<void> {
  await axios.put(`${API_URL_cart}/${productId}`, { quantity });
}

export async function removeCartItem(productId: number): Promise<void> {
  await axios.delete(`${API_URL_cart}/${productId}`);
}
