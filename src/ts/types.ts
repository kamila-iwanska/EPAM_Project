export type Size = 'S' | 'M' | 'L' | 'XL' ;
export type Color = 'red' | 'blue' | 'green' | 'black' | 'grey' | 'yellow' | 'pink';
export type Category = 'carry-ons' | 'suitcases' | 'luggage sets' | 'kids\' luggage';
export type Block = 'New Products Arrival' | 'Selected Products' | 'You May Also Like';
export type Order = 'price-asc' | 'price-dsc' | 'popularity-dsc' | 'rating-dsc';

export type Product = {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  category: Category;
  color: Color;
  size: Size;
  salesStatus: boolean;
  rating: number;
  popularity: number;
  blocks: Block[];
}

export type CartItem = {
  productId: string;
  quantity: number;
}