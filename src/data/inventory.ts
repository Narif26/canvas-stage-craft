import stringLightsImg from "@/assets/string_lights.jpg";
import chandelierImg from "@/assets/chandelier.jpg";
import uplightImg from "@/assets/uplight.jpg";

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
    image: stringLightsImg,
    quantity: 30,
  },
  {
    id: "light-2",
    name: "Chandelier",
    category: "Lighting",
    image: chandelierImg,
    quantity: 10,
  },
  {
    id: "light-3",
    name: "LED Uplights",
    category: "Lighting",
    image: uplightImg,
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
