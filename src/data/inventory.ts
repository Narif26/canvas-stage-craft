export type InventoryCategory = "Backdrops" | "Sofas" | "Chairs" | "Flowers" | "Props" | "Lighting";

export interface InventoryItem {
  id: string;
  name: string;
  category: InventoryCategory;
  image: string;
  quantity: number;
}

export const inventoryData: InventoryItem[] = [
  // Backdrops - empty, add your own items
  
  // Sofas - empty, add your own items
  
  // Chairs - empty, add your own items
  
  // Flowers - empty, add your own items
  
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
