export type Category = "All" | "Sarees" | "Lehengas" | "Kurtis" | "Anarkalis" | "Suits";

export interface Product {
  id: string;
  name: string;
  price: number;
  category: Category;
  rating: number;
  reviews: number;
  image: string;
  video?: string;
  description: string;
  sizes: string[];
  colors: string[];
  new: boolean;
  stock: number;
}

export interface CartItem extends Product {
  qty: number;
  selectedSize: string;
  selectedColor: string;
}

export interface Order {
  id: string;
  userId: string;
  items: any[];
  total: number;
  status: "pending" | "shipped" | "delivered" | "cancelled";
  createdAt: string;
  address?: {
    street: string;
    city: string;
    zip: string;
  };
  paymentStatus?: "paid" | "unpaid";
  paymentMethod?: "card" | "upi" | "cod";
  paymentDetails?: {
    last4?: string;
    brand?: string;
    transactionId?: string;
  };
  trackingNumber?: string;
  shippingCarrier?: string;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userPhoto?: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  role: "admin" | "user";
  createdAt: string;
  phoneNumber?: string;
  addresses?: Address[];
}

export interface Address {
  id: string;
  label: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  isDefault: boolean;
}
