export type InventoryCategory = "Backdrops" | "Sofas" | "Chairs" | "Flowers" | "Props" | "Lighting";

export interface InventoryItem {
  id: string;
  name: string;
  category: InventoryCategory;
  image: string;
  quantity: number;
}

export const inventoryData: InventoryItem[] = [
  // Backdrops
  {
    id: "backdrop-1",
    name: "Floral Arch Backdrop",
    category: "Backdrops",
    image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400&h=400&fit=crop",
    quantity: 5,
  },
  {
    id: "backdrop-2",
    name: "Elegant Drape Backdrop",
    category: "Backdrops",
    image: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=400&h=400&fit=crop",
    quantity: 8,
  },
  {
    id: "backdrop-3",
    name: "Rustic Wood Backdrop",
    category: "Backdrops",
    image: "https://images.unsplash.com/photo-1536924940846-227afb31e2a5?w=400&h=400&fit=crop",
    quantity: 3,
  },
  
  // Sofas
  {
    id: "sofa-1",
    name: "Velvet Lounge Sofa",
    category: "Sofas",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop",
    quantity: 6,
  },
  {
    id: "sofa-2",
    name: "Chesterfield Sofa",
    category: "Sofas",
    image: "https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=400&h=400&fit=crop",
    quantity: 4,
  },
  {
    id: "sofa-3",
    name: "Modern White Sofa",
    category: "Sofas",
    image: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=400&h=400&fit=crop",
    quantity: 7,
  },
  
  // Chairs
  {
    id: "chair-1",
    name: "Gold Chiavari Chair",
    category: "Chairs",
    image: "https://images.unsplash.com/photo-1503602642458-232111445657?w=400&h=400&fit=crop",
    quantity: 50,
  },
  {
    id: "chair-2",
    name: "Ghost Chair",
    category: "Chairs",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop",
    quantity: 40,
  },
  {
    id: "chair-3",
    name: "Vintage Wooden Chair",
    category: "Chairs",
    image: "https://images.unsplash.com/photo-1503602642458-232111445657?w=400&h=400&fit=crop",
    quantity: 35,
  },
  
  // Flowers
  {
    id: "flower-1",
    name: "Rose Centerpiece",
    category: "Flowers",
    image: "https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?w=400&h=400&fit=crop",
    quantity: 20,
  },
  {
    id: "flower-2",
    name: "Orchid Arrangement",
    category: "Flowers",
    image: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400&h=400&fit=crop",
    quantity: 15,
  },
  {
    id: "flower-3",
    name: "Tropical Bouquet",
    category: "Flowers",
    image: "https://images.unsplash.com/photo-1520763185298-1b434c919102?w=400&h=400&fit=crop",
    quantity: 18,
  },
  {
    id: "flower-4",
    name: "Peony Centerpiece",
    category: "Flowers",
    image: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=400&h=400&fit=crop",
    quantity: 12,
  },
  
  // Props
  {
    id: "prop-1",
    name: "Gold Frame Mirror",
    category: "Props",
    image: "https://images.unsplash.com/photo-1618220179428-22790b461013?w=400&h=400&fit=crop",
    quantity: 8,
  },
  {
    id: "prop-2",
    name: "Vintage Ladder",
    category: "Props",
    image: "https://images.unsplash.com/photo-1587582423116-ec07293f0395?w=400&h=400&fit=crop",
    quantity: 5,
  },
  {
    id: "prop-3",
    name: "Decorative Vases",
    category: "Props",
    image: "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=400&h=400&fit=crop",
    quantity: 25,
  },
  
  // Lighting
  {
    id: "light-1",
    name: "String Lights",
    category: "Lighting",
    image: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=400&h=400&fit=crop",
    quantity: 30,
  },
  {
    id: "light-2",
    name: "Chandelier",
    category: "Lighting",
    image: "https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=400&h=400&fit=crop",
    quantity: 10,
  },
  {
    id: "light-3",
    name: "LED Uplights",
    category: "Lighting",
    image: "https://images.unsplash.com/photo-1556912173-46c336c7fd55?w=400&h=400&fit=crop",
    quantity: 40,
  },
];

export const categories: InventoryCategory[] = [
  "Backdrops",
  "Sofas", 
  "Chairs",
  "Flowers",
  "Props",
  "Lighting",
];
