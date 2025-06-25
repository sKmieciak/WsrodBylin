import axios from "axios";
import { API_URL } from "../data/Api_URL";
const API_URL_cart = API_URL + "api/cart";

// === Typy DTO ===

export interface CartItemDto {
  id: number;
  productId: number;
  productName: string;
  productImage: string;
  productPrice: number;
  quantity: number;
}

export interface CartItemCreateDto {
  productId: number;
  quantity: number;
}

export interface CartItemUpdateDto {
  quantity: number;
}

// === Pomocnicza funkcja z tokenem ===

function getAuthHeader() {
  const stored = localStorage.getItem("auth"); 
  if (!stored) return {};

  try {
    const parsed = JSON.parse(stored);
    const token = parsed.token;
    if (!token) return {};

    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  } catch {
    return {};
  }
}



// === Funkcje API ===

export async function getCart(): Promise<CartItemDto[]> {
  const response = await axios.get(API_URL_cart, getAuthHeader());
  return response.data;
}

export async function addToCart(item: CartItemCreateDto): Promise<void> {
  await axios.post(API_URL_cart, item, getAuthHeader());
}

export async function updateCartItem(productId: number, quantity: number): Promise<void> {
  const dto: CartItemUpdateDto = { quantity };
  await axios.put(`${API_URL_cart}/${productId}`, dto, getAuthHeader());
}

export async function removeCartItem(productId: number): Promise<void> {
  await axios.delete(`${API_URL_cart}/${productId}`, getAuthHeader());
}
