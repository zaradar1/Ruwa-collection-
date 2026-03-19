import { Product } from "./types";

export const CATEGORIES = ["All", "Sarees", "Lehengas", "Kurtis", "Anarkalis", "Suits"];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Royal Bridal Lehenga",
    price: 499.99,
    category: "Lehengas",
    rating: 4.9,
    reviews: 124,
    image: "https://image.qwenlm.ai/public_source/2cea05b4-e842-4876-8e91-c3a877163ecc/122fdc590-6d5f-4dd3-b74d-de66ce389a7e.png",
    description: "A stunning red velvet lehenga with intricate gold zari work and mirror detailing. Perfect for weddings and grand receptions.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Red", "Maroon"],
    new: true,
    stock: 10
  },
  {
    id: "2",
    name: "Pastel Floral Kurti Set",
    price: 89.99,
    category: "Kurtis",
    rating: 4.7,
    reviews: 89,
    image: "https://image.qwenlm.ai/public_source/2cea05b4-e842-4876-8e91-c3a877163ecc/1cddee9b6-5410-4e52-8a77-70c2f92f0ec7.png",
    description: "Comfortable cotton kurta with delicate floral prints, paired with white churidar and a matching dupatta. Ideal for daily wear.",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Pink", "Peach", "Mint"],
    new: true,
    stock: 25
  },
  {
    id: "3",
    name: "Banarasi Silk Saree",
    price: 299.50,
    category: "Sarees",
    rating: 4.8,
    reviews: 210,
    image: "https://image.qwenlm.ai/public_source/2cea05b4-e842-4876-8e91-c3a877163ecc/13abb5538-a695-4b0b-afd3-2190fc1319e6.png",
    description: "Authentic Banarasi silk saree in royal blue with silver zari border. Comes with a matching blouse piece.",
    sizes: ["Free Size"],
    colors: ["Blue", "Green", "Purple"],
    new: false,
    stock: 15
  },
  {
    id: "4",
    name: "Golden Anarkali Suit",
    price: 179.99,
    category: "Anarkalis",
    rating: 4.9,
    reviews: 156,
    image: "https://image.qwenlm.ai/public_source/2cea05b4-e842-4876-8e91-c3a877163ecc/17328a23f-7f20-4476-9954-dff06b89ffba.png",
    description: "Heavy embroidered golden Anarkali suit with velvet texture. A statement piece for festive occasions.",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Gold", "Beige"],
    new: true,
    stock: 8
  },
  {
    id: "5",
    name: "Embroidered Chiffon Saree",
    price: 149.99,
    category: "Sarees",
    rating: 4.6,
    reviews: 340,
    image: "https://images.unsplash.com/photo-1610189012906-478338104311?auto=format&fit=crop&q=80&w=800",
    description: "Lightweight chiffon saree with all-over embroidery. Elegant and easy to drape.",
    sizes: ["Free Size"],
    colors: ["Yellow", "Orange", "Teal"],
    new: false,
    stock: 20
  },
  {
    id: "6",
    name: "Designer Palazzo Suit",
    price: 110.00,
    category: "Suits",
    rating: 4.5,
    reviews: 98,
    image: "https://images.unsplash.com/photo-1583391726247-bd7475808a66?auto=format&fit=crop&q=80&w=800",
    description: "Modern Indo-western palazzo suit with geometric prints. Comfortable for office and casual outings.",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "White", "Navy"],
    new: false,
    stock: 12
  }
];
