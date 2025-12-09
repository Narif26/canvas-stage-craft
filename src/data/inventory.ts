import stringLightsImg from "@/assets/string_lights.jpg";
import chandelierImg from "@/assets/chandelier.jpg";

import colorfulArchImg from "@/assets/colorful_arch.png";
import pinkCurtainImg from "@/assets/pink_curtain.png";
import midSizeSofaImg from "@/assets/mid_size_sofa.png";
import smallSofaImg from "@/assets/small_sofa.png";
import smallBenchImg from "@/assets/small_bench.png";

import goldBackdropImg from "@/assets/gold_backdrop.png";
import rectangleFlowerArchImg from "@/assets/rectangle_flower_arch.png";
import rectangleFlowerArch2Img from "@/assets/rectangle_flower_arch2.png";
import roundBackdropImg from "@/assets/round_backdrop.png";
import sideChairImg from "@/assets/side_chair.png";

import purpleFlowerImg from "@/assets/purple_flower.png";
import redFlowerImg from "@/assets/red_flower.png";
import whiteFlowerImg from "@/assets/white_flower.png";
import pinkOrangeFlowerImg from "@/assets/pink_orange_flower.png";

import roundChairImg from "@/assets/round_chair.png";
import redMandapImg from "@/assets/red_mandap.png";
import cakeStandImg from "@/assets/cake_stand.png";
import heavyArchImg from "@/assets/heavy_arch.png";
import largeSofaImg from "@/assets/large_sofa.png";

import goldFrameImg from "@/assets/gold_frame.png";
import goldSquareArchImg from "@/assets/gold_square_arch.png";
import turkishBackdropImg from "@/assets/turkish_backdrop.png";
import ledArchImg from "@/assets/led_arch.png";
import crystalFloralTowerImg from "@/assets/crystal_floral_tower.png";
import crystalChandelierStandImg from "@/assets/crystal_chandelier_stand.png";

export type InventoryCategory = "Backdrops" | "Drapes" | "Sofas" | "Chairs" | "Flowers" | "Accessories" | "Lighting" | "Flooring/Rugs" | "Pillows";

export interface InventoryItem {
  id: string;
  name: string;
  category: InventoryCategory;
  image: string;
  quantity: number;
}

export const inventoryData: InventoryItem[] = [
  // Backdrops (arches and frames)
  {
    id: "backdrop-1",
    name: "Colorful Arch",
    category: "Backdrops",
    image: colorfulArchImg,
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
  {
    id: "backdrop-8",
    name: "Red Mandap",
    category: "Backdrops",
    image: redMandapImg,
    quantity: 1,
  },
  {
    id: "backdrop-9",
    name: "3 Round Arch",
    category: "Backdrops",
    image: heavyArchImg,
    quantity: 1,
  },
  {
    id: "backdrop-10",
    name: "Gold Frame Arch",
    category: "Backdrops",
    image: goldFrameImg,
    quantity: 1,
  },
  {
    id: "backdrop-11",
    name: "Gold Square Arch",
    category: "Backdrops",
    image: goldSquareArchImg,
    quantity: 1,
  },
  {
    id: "backdrop-12",
    name: "Turkish Backdrop",
    category: "Backdrops",
    image: turkishBackdropImg,
    quantity: 1,
  },
  {
    id: "backdrop-13",
    name: "LED Wave Arch",
    category: "Backdrops",
    image: ledArchImg,
    quantity: 1,
  },
  
  // Drapes
  {
    id: "drape-1",
    name: "Pink Curtain",
    category: "Drapes",
    image: pinkCurtainImg,
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
  {
    id: "sofa-3",
    name: "Large Sofa",
    category: "Sofas",
    image: largeSofaImg,
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
  {
    id: "chair-3",
    name: "Round Chair",
    category: "Chairs",
    image: roundChairImg,
    quantity: 2,
  },
  
  // Flowers - no quantity limit (99 = unlimited)
  {
    id: "flower-1",
    name: "Purple Flowers",
    category: "Flowers",
    image: purpleFlowerImg,
    quantity: 99,
  },
  {
    id: "flower-2",
    name: "Red Flowers",
    category: "Flowers",
    image: redFlowerImg,
    quantity: 99,
  },
  {
    id: "flower-3",
    name: "White Flowers",
    category: "Flowers",
    image: whiteFlowerImg,
    quantity: 99,
  },
  {
    id: "flower-4",
    name: "Pink & Orange Flowers",
    category: "Flowers",
    image: pinkOrangeFlowerImg,
    quantity: 99,
  },
  
  // Accessories
  {
    id: "accessory-1",
    name: "Cake Stand",
    category: "Accessories",
    image: cakeStandImg,
    quantity: 1,
  },
  {
    id: "accessory-2",
    name: "Crystal Floral Tower",
    category: "Accessories",
    image: crystalFloralTowerImg,
    quantity: 6,
  },
  {
    id: "accessory-3",
    name: "Crystal Chandelier Stand",
    category: "Accessories",
    image: crystalChandelierStandImg,
    quantity: 6,
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
    quantity: 4,
  },
  
  // Flooring/Rugs - empty, add your own items
  
  // Pillows - empty, add your own items
];

export const categories: InventoryCategory[] = [
  "Backdrops",
  "Drapes",
  "Sofas", 
  "Chairs",
  "Flowers",
  "Accessories",
  "Lighting",
  "Flooring/Rugs",
  "Pillows",
];
