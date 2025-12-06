import stringLightsImg from "@/assets/string_lights.jpg";
import chandelierImg from "@/assets/chandelier.jpg";
import uplightImg from "@/assets/uplight.jpg";
import colorfulArchImg from "@/assets/colorful_arch.png";
import pinkCurtainImg from "@/assets/pink_curtain.png";
import midSizeSofaImg from "@/assets/mid_size_sofa.png";
import smallSofaImg from "@/assets/small_sofa.png";
import smallBenchImg from "@/assets/small_bench.png";
import colorfulArch2Img from "@/assets/colorful_arch_2.png";
import goldBackdropImg from "@/assets/gold_backdrop.png";
import rectangleFlowerArchImg from "@/assets/rectangle_flower_arch.png";
import rectangleFlowerArch2Img from "@/assets/rectangle_flower_arch2.png";
import roundBackdropImg from "@/assets/round_backdrop.png";
import sideChairImg from "@/assets/side_chair.png";

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
    name: "Colorful Arch",
    category: "Backdrops",
    image: colorfulArchImg,
    quantity: 1,
  },
  {
    id: "backdrop-2",
    name: "Pink Curtain",
    category: "Backdrops",
    image: pinkCurtainImg,
    quantity: 1,
  },
  {
    id: "backdrop-3",
    name: "Colorful Curtain Arch",
    category: "Backdrops",
    image: colorfulArch2Img,
    quantity: 1,
  },
  {
    id: "backdrop-4",
    name: "Gold Backdrop",
    category: "Backdrops",
    image: goldBackdropImg,
    quantity: 1,
  },
  {
    id: "backdrop-5",
    name: "Rectangle Flower Arch",
    category: "Backdrops",
    image: rectangleFlowerArchImg,
    quantity: 1,
  },
  {
    id: "backdrop-6",
    name: "Rectangle Flower Arch 2",
    category: "Backdrops",
    image: rectangleFlowerArch2Img,
    quantity: 1,
  },
  {
    id: "backdrop-7",
    name: "Round Backdrop",
    category: "Backdrops",
    image: roundBackdropImg,
    quantity: 1,
  },
  
  // Sofas
  {
    id: "sofa-1",
    name: "Mid-Size Sofa",
    category: "Sofas",
    image: midSizeSofaImg,
    quantity: 1,
  },
  {
    id: "sofa-2",
    name: "Small Sofa",
    category: "Sofas",
    image: smallSofaImg,
    quantity: 1,
  },
  
  // Chairs
  {
    id: "chair-1",
    name: "Small Bench",
    category: "Chairs",
    image: smallBenchImg,
    quantity: 1,
  },
  {
    id: "chair-2",
    name: "Side Chair",
    category: "Chairs",
    image: sideChairImg,
    quantity: 2,
  },
  
  // Flowers - empty, add your own items
  
  // Props
  {
    id: "prop-1",
    name: "Gold Frame Mirror",
    category: "Props",
    image: "https://images.unsplash.com/photo-1618220179428-22790b461013?w=400&h=400&fit=crop",
    quantity: 1,
  },
  {
    id: "prop-2",
    name: "Vintage Ladder",
    category: "Props",
    image: "https://images.unsplash.com/photo-1587582423116-ec07293f0395?w=400&h=400&fit=crop",
    quantity: 1,
  },
  {
    id: "prop-3",
    name: "Decorative Vases",
    category: "Props",
    image: "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=400&h=400&fit=crop",
    quantity: 1,
  },
  
  // Lighting
  {
    id: "light-1",
    name: "String Lights",
    category: "Lighting",
    image: stringLightsImg,
    quantity: 1,
  },
  {
    id: "light-2",
    name: "Chandelier",
    category: "Lighting",
    image: chandelierImg,
    quantity: 1,
  },
  {
    id: "light-3",
    name: "LED Uplights",
    category: "Lighting",
    image: uplightImg,
    quantity: 1,
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
