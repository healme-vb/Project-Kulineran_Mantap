export interface Food {
  id: number;
  name: string;
  category: string;
  price: number;
  rating: number;
  image: string;
  description: string;
  popular?: boolean;
}

export interface CartItem {
  food: Food;
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  date: string;
  status: "Diproses" | "Sedang diantar" | "Selesai" | "Dibatalkan";
}
