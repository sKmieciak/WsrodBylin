import { useEffect, useState } from "react";
import axios from "../lib/axios";

export interface OrderItem {
  productId: number;
  productName: string;
  productImage: string;
  quantity: number;
  priceAtPurchase: number;
}

export interface Order {
  id: number;
  createdAt: string;
  courier: string;
  paymentMethod: string;
  deliveryCost: number;
  status: number;
  paymentStatus: number;
  items: OrderItem[];
}

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios
      .get("/api/order")
      .then((res) => setOrders(res.data))
      .catch(() => setError("Nie udało się pobrać zamówień."))
      .finally(() => setLoading(false));
  }, []);

  return { orders, loading, error };
}
