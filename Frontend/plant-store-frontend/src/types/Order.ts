// types/Order.ts
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

export interface OrderAdminDto {
  id: number;
  userFullName: string;
  userEmail: string;
  userPhone: string | null;
  address: string | null;
  createdAt: string;
  status: number;
  paymentStatus: number;
  courier: string;
  paymentMethod: string;
  deliveryCost: number;
  trackingNumber: string | null;
  paczkomatPoint: string | null;
  items: OrderItem[];
}

export const OrderStatusLabels: Record<number, string> = {
  0: "Oczekuje",
  1: "Potwierdzone",
  2: "Wysłane",
  3: "Dostarczone",
};

export const PaymentStatusLabels: Record<number, string> = {
  0: "Nieopłacone",
  1: "Opłacone",
  2: "Błąd płatności",
};
