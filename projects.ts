export interface Product {
  id: string;
  name: string;
  price: number;
  category: 'laptop' | 'phone' | 'accessory';
  image: string; // Path relative to /public or an external URL
  specs: string[];
}

export const products: Product[] = [
  {
    id: 'hp-elitebook-840-g5',
    name: 'HP EliteBook 840 G5',
    price: 35000,
    category: 'laptop',
    image: '/images/hp-840-g5.jpg',
    specs: ['Core i5 8th Gen', '8GB RAM', '256GB SSD', 'Touchscreen'],
  },
  {
    id: 'iphone-x-64gb',
    name: 'iPhone X 64GB',
    price: 28000,
    category: 'phone',
    image: '/images/iphone-x.jpg',
    specs: ['64GB Storage', 'Face ID', 'Battery 90% Health'],
  },
  {
    id: 'dell-xps-13',
    name: 'Dell XPS 13 9360',
    price: 55000,
    category: 'laptop',
    image: '/images/dell-xps.jpg',
    specs: ['Core i7 7th Gen', '16GB RAM', '512GB SSD', 'InfinityEdge Display'],
  },
  {
    id: 'samsung-s10',
    name: 'Samsung Galaxy S10',
    price: 22000,
    category: 'phone',
    image: '/images/samsung-s10.jpg',
    specs: ['128GB Storage', 'Prism Black', 'Dual SIM'],
  }
];