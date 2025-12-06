import { useState, useEffect } from "react";
import { inventoryData } from "@/data/inventory";

export interface QuantityState {
  [itemId: string]: number;
}

const STORAGE_KEY = "inventoryQuantities";

const getInitialQuantities = (): QuantityState => {
  const stored = sessionStorage.getItem(STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  // Initialize from inventory data
  const initial: QuantityState = {};
  inventoryData.forEach((item) => {
    initial[item.id] = item.quantity;
  });
  return initial;
};

export const useInventoryQuantities = () => {
  const [quantities, setQuantities] = useState<QuantityState>(getInitialQuantities);

  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(quantities));
  }, [quantities]);

  const decrementQuantity = (itemId: string) => {
    setQuantities((prev) => ({
      ...prev,
      [itemId]: Math.max(0, (prev[itemId] || 0) - 1),
    }));
  };

  const resetQuantities = () => {
    const initial: QuantityState = {};
    inventoryData.forEach((item) => {
      initial[item.id] = item.quantity;
    });
    setQuantities(initial);
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
  };

  const getAvailableQuantity = (itemId: string): number => {
    return quantities[itemId] ?? 0;
  };

  return {
    quantities,
    decrementQuantity,
    resetQuantities,
    getAvailableQuantity,
  };
};
