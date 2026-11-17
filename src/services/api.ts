import type { Order } from "../types/food";

const API_URL = "http://localhost:4000/api";

async function request<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`Request gagal: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export async function fetchOrders(): Promise<Order[]> {
  return request<Order[]>("/orders");
}

export async function createOrder(order: Omit<Order, "id">): Promise<Order> {
  return request<Order>("/orders", {
    method: "POST",
    body: JSON.stringify(order),
  });
}

export async function updateOrderStatus(
  orderId: string,
  status: Order["status"],
): Promise<Order> {
  return request<Order>(`/orders/${encodeURIComponent(orderId)}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}
