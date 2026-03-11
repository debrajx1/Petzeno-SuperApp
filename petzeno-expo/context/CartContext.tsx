import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  brand: string;
  category: "food" | "medicine" | "toys" | "accessories" | "grooming" | "supplements";
  rating: number;
  reviewCount: number;
  stock: number;
  image: string;
  storeId: string;
  storeName: string;
  tags: string[];
};

export type CartItem = {
  product: Product;
  quantity: number;
};

export type Order = {
  id: string;
  items: CartItem[];
  total: number;
  status: "processing" | "shipped" | "delivered" | "cancelled";
  orderDate: string;
  deliveryAddress: string;
};

type CartContextType = {
  cartItems: CartItem[];
  orders: Order[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  placeOrder: (deliveryAddress: string) => Order;
  cartTotal: number;
  cartCount: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const DEMO_PRODUCTS: Product[] = [
  {
    id: "prod_001",
    name: "Premium Dog Food",
    description: "High-protein formula with real chicken and vegetables. Complete nutrition for adult dogs.",
    price: 899,
    originalPrice: 1099,
    brand: "Royal Canin",
    category: "food",
    rating: 4.5,
    reviewCount: 234,
    stock: 50,
    image: "🐾",
    storeId: "store_001",
    storeName: "PetMart",
    tags: ["dog", "food", "adult"],
  },
  {
    id: "prod_002",
    name: "Cat Premium Kibble",
    description: "Balanced nutrition for indoor cats. Rich in omega-3 for shiny coat.",
    price: 749,
    originalPrice: 899,
    brand: "Whiskas",
    category: "food",
    rating: 4.3,
    reviewCount: 178,
    stock: 35,
    image: "🐱",
    storeId: "store_001",
    storeName: "PetMart",
    tags: ["cat", "food", "indoor"],
  },
  {
    id: "prod_003",
    name: "Squeaky Toy Bundle",
    description: "Set of 5 squeaky toys made from durable, non-toxic materials. Perfect for small to medium dogs.",
    price: 349,
    brand: "PawPlay",
    category: "toys",
    rating: 4.7,
    reviewCount: 89,
    stock: 20,
    image: "🎾",
    storeId: "store_002",
    storeName: "Happy Paws Store",
    tags: ["dog", "toy", "play"],
  },
  {
    id: "prod_004",
    name: "Pet Vitamin Complex",
    description: "Complete multivitamin for dogs and cats. Supports immunity, joints, and coat health.",
    price: 599,
    originalPrice: 699,
    brand: "VetCare",
    category: "supplements",
    rating: 4.6,
    reviewCount: 312,
    stock: 45,
    image: "💊",
    storeId: "store_001",
    storeName: "PetMart",
    tags: ["vitamin", "health", "supplement"],
  },
  {
    id: "prod_005",
    name: "Grooming Kit Pro",
    description: "Complete 7-piece grooming set including brush, nail trimmer, ear cleaner, and more.",
    price: 899,
    brand: "GroomPro",
    category: "grooming",
    rating: 4.4,
    reviewCount: 156,
    stock: 15,
    image: "✂️",
    storeId: "store_002",
    storeName: "Happy Paws Store",
    tags: ["grooming", "tools"],
  },
  {
    id: "prod_006",
    name: "Adjustable Harness",
    description: "No-pull, padded harness for comfortable walks. Reflective strips for night safety.",
    price: 449,
    originalPrice: 549,
    brand: "SafeWalk",
    category: "accessories",
    rating: 4.8,
    reviewCount: 421,
    stock: 30,
    image: "🦮",
    storeId: "store_001",
    storeName: "PetMart",
    tags: ["dog", "harness", "walk"],
  },
  {
    id: "prod_007",
    name: "Tick & Flea Spray",
    description: "Fast-acting, water-resistant formula. Protects for up to 30 days.",
    price: 299,
    brand: "PetShield",
    category: "medicine",
    rating: 4.2,
    reviewCount: 98,
    stock: 60,
    image: "🌿",
    storeId: "store_001",
    storeName: "PetMart",
    tags: ["medicine", "health", "protection"],
  },
  {
    id: "prod_008",
    name: "Interactive Puzzle Feeder",
    description: "Mental stimulation toy that slows eating. Reduces bloat and boredom.",
    price: 549,
    brand: "MindPets",
    category: "toys",
    rating: 4.6,
    reviewCount: 203,
    stock: 25,
    image: "🧩",
    storeId: "store_002",
    storeName: "Happy Paws Store",
    tags: ["dog", "cat", "toy", "feeder"],
  },
  {
    id: "prod_009",
    name: "Orthopedic Pet Bed",
    description: "Memory foam pet bed with washable cover. Perfect for senior pets.",
    price: 1299,
    originalPrice: 1599,
    brand: "DreamPaws",
    category: "accessories",
    rating: 4.9,
    reviewCount: 567,
    stock: 10,
    image: "🛏️",
    storeId: "store_002",
    storeName: "Happy Paws Store",
    tags: ["dog", "cat", "bed", "comfort"],
  },
  {
    id: "prod_010",
    name: "Dental Chews",
    description: "Enzymatic chews that clean teeth and freshen breath. Vet recommended.",
    price: 249,
    brand: "DentaClean",
    category: "medicine",
    rating: 4.3,
    reviewCount: 445,
    stock: 80,
    image: "🦷",
    storeId: "store_001",
    storeName: "PetMart",
    tags: ["dog", "dental", "health"],
  },
];

function generateId(prefix: string): string {
  return `${prefix}_${Date.now()}${Math.random().toString(36).substr(2, 9)}`;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      const [cartData, ordersData] = await Promise.all([
        AsyncStorage.getItem("petcare_cart"),
        AsyncStorage.getItem("petcare_orders"),
      ]);
      if (cartData) setCartItems(JSON.parse(cartData));
      if (ordersData) setOrders(JSON.parse(ordersData));
    } catch {}
  };

  const saveCart = async (items: CartItem[]) => {
    try {
      await AsyncStorage.setItem("petcare_cart", JSON.stringify(items));
    } catch {}
  };

  const saveOrders = async (orderList: Order[]) => {
    try {
      await AsyncStorage.setItem("petcare_orders", JSON.stringify(orderList));
    } catch {}
  };

  const addToCart = (product: Product, quantity = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      let updated: CartItem[];
      if (existing) {
        updated = prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        updated = [...prev, { product, quantity }];
      }
      saveCart(updated);
      return updated;
    });
  };

  const removeFromCart = (productId: string) => {
    setCartItems((prev) => {
      const updated = prev.filter((item) => item.product.id !== productId);
      saveCart(updated);
      return updated;
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems((prev) => {
      const updated = prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      );
      saveCart(updated);
      return updated;
    });
  };

  const clearCart = () => {
    setCartItems([]);
    AsyncStorage.removeItem("petcare_cart");
  };

  const placeOrder = (deliveryAddress: string): Order => {
    const order: Order = {
      id: generateId("ord"),
      items: [...cartItems],
      total: cartTotal,
      status: "processing",
      orderDate: new Date().toISOString(),
      deliveryAddress,
    };
    setOrders((prev) => {
      const updated = [order, ...prev];
      saveOrders(updated);
      return updated;
    });
    clearCart();
    return order;
  };

  const cartTotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        orders,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        placeOrder,
        cartTotal,
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}
