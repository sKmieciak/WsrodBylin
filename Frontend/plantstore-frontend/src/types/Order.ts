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
  status: string;
  items: OrderItem[];
}
