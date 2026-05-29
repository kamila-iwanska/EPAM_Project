import database from '../assets/data.json' with { type: 'json' };
import { Block, CartItem, Category, Color, Order, Product, Size } from './types.js';

const products = database.data as Product[];

let cartItems: CartItem[] = [];

export function initializeState() {
  cartItems = JSON.parse(localStorage.getItem('CART') ?? '[]') as CartItem[];
  handleCartChange();
}

function handleCartChange() {
  localStorage.setItem('CART', JSON.stringify(cartItems));

  const cartCounterEl = document.getElementById('cart-counter');
  if (cartCounterEl) {
    const totalQuantity = cartItems.reduce((total, item) => total + item.quantity, 0);
    cartCounterEl.textContent = totalQuantity > 0 ? totalQuantity.toString() : '';
  }
}

export function getAllCartItems(): CartItem[] {
  return cartItems;
}

export function addToCart(productId: string, quantity: number) {
  const existingCartItem = cartItems.find((item) => item.productId === productId);
  if (existingCartItem) {
    existingCartItem.quantity += quantity;
  } else {
    cartItems.push({ productId, quantity });
  }
  handleCartChange();
}

export function removeFromCart(productId: string, quantity: number) {
  const existingCartItem = cartItems.find((item) => item.productId === productId);
  if (!existingCartItem) return;
  existingCartItem.quantity -= quantity;
  cartItems = cartItems.filter((item) => item.quantity > 0);
  handleCartChange();
}

export function clearCart() {
  cartItems = [];
  handleCartChange();
}

export function getProductById(productId: string): Product | null {
  return products.find((product) => product.id === productId) || null;
}

export function getProductsForBlock(block: Block): Product[] {
  return products.filter((p) => p.blocks.includes(block));
}

export function getProductsFromCategory(category: Category): Product[] {
  return products.filter((p) => p.category === category);
}

function doesProductMatchSize(product: Product, size?: Size | 'S-L' | 'S, M, XL'): boolean {
  if (size == 'S-L') {
    if (!['S', 'M', 'L'].includes(product.size)) return false;
  } else if (size === 'S, M, XL') {
    if (!['S', 'M', 'XL'].includes(product.size)) return false;
  } else if (size && product.size !== size) {
    return false;
  }
  return true;
}

export function paginateProducts(args: {
  size?: Size | 'S-L' | 'S, M, XL';
  color?: Color;
  category?: Category;
  salesStatus?: boolean;
  order: Order;
  search: string;
  limit: number;
  offset: number;
}): { items: Product[]; count: number } {
  const filteredItems = products.filter((p) => {
    if (!doesProductMatchSize(p, args.size)) return false;
    if (args.color && p.color !== args.color) return false;
    if (args.category && p.category !== args.category) return false;
    if (args.salesStatus && !p.salesStatus) return false;
    if (args.search && !p.name.toLowerCase().includes(args.search.toLowerCase())) return false;
    return true;
  });

  return {
    items: filteredItems
      .toSorted((a, b) => {
        switch (args.order) {
          case 'price-asc':
            return a.price - b.price;
          case 'price-dsc':
            return b.price - a.price;
          case 'popularity-dsc':
            return b.popularity - a.popularity;
          case 'rating-dsc':
            return b.rating - a.rating;
        }
      })
      .slice(args.offset, args.offset + args.limit),
    count: filteredItems.length,
  }
}