// hooks/useOrders.ts
import { useEffect, useState } from "react";
import axios from "axios";

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
  status: string;
  items: OrderItem[];
}

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("/api/order").then((res) => {
      setOrders(res.data);
      setLoading(false);
    });
  }, []);

  return { orders, loading };
}
