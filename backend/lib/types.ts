// TypeScript types matching exact Supabase Database Schema

export interface Category {
  id: string;
  name: string;
  slug: string;
  logo_url?: string | null;
  parent_id?: string | null;
  description?: string | null;
  display_order?: number;
  created_at?: string;
  children?: Category[];
}

export interface ProductAttribute {
  id?: string;
  name: string;
  values: string[];
}

export interface Product {
  id: string;
  handle: string;           // Unique handle used for URLs (/product/[slug])
  title: string;            // Product title
  body_html: string | null; // Product description HTML/text
  vendor: string | null;    // Brand
  category: string | null;
  categories?: string[];
  type: string | null;
  tags: string | null;
  status: string;           // 'active' | 'draft'
  price: number;            // 0.00 indicates "Price on request"
  compare_at_price?: number | null;
  main_image: string | null;// Primary image URL
  product_type: string;     // 'simple' | 'variable'
  attributes?: ProductAttribute[];
  created_at?: string;
  // Joined or fetched relations
  variants?: ProductVariant[];
  images?: ProductImage[];
}

export interface ProductVariant {
  id: string;
  product_handle: string;
  product_id?: string;
  sku: string | null;
  option_name: string | null;   // e.g. "Flavor", "Color", "Size"
  option_value: string | null;  // e.g. "Mango Mania", "Pink"
  attributes?: Record<string, string>; // e.g. { Size: "L", Color: "Black" }
  price: number;
  compare_at_price?: number | null;
  inventory_qty: number;
  image_src: string | null;
  barcode?: string | null;
  is_active?: boolean;
  created_at?: string;
}

export interface ProductImage {
  id: string;
  product_handle: string;
  image_src: string;
  position: number | null;
  alt_text: string | null;
}

export interface Banner {
  id: string;
  image_url: string;
  eyebrow: string | null;
  title: string | null;
  description: string | null;
  cta_text: string | null;
  cta_link: string | null;
  position: number;
  active: boolean;
}

export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  customer_name: string;
  phone: string;
  address: string | null;
  status: OrderStatus;
  notes: string | null;
  created_at?: string;
  items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_handle: string | null;
  variant_id: string | null;
  qty: number;
  unit_price: number | null;
  product_name?: string;
  variant_label?: string;
}

// Client-side cart item
export interface CartItem {
  product_handle: string;
  variant_id?: string;
  name: string;
  variant_label?: string;
  price: number;
  quantity: number;
  image_url?: string;
}

export interface Cart {
  items: CartItem[];
  total: number;
}
