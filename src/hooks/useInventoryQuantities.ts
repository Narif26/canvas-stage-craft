import { useState, useEffect } from "react";
import { inventoryData, InventoryCategory } from "@/data/inventory";

export interface QuantityState {
  [itemId: string]: number;
}

export interface SelectedCategoriesState {
  [category: string]: string | null; // category -> selected item id
}

const STORAGE_KEY = "inventoryQuantities";
const SELECTED_CATEGORIES_KEY = "selectedCategories";

// Categories that only allow 1 selection
const SINGLE_SELECT_CATEGORIES: InventoryCategory[] = ["Sofas"];

const getInitialQuantities = (): QuantityState => {
  const stored = sessionStorage.getItem(STORAGE_KEY);
  if (stored) {
    const parsed = JSON.parse(stored);
    // Validate stored data matches current inventory - if item exists in inventory but not in stored, reset
    const needsReset = inventoryData.some(item => !(item.id in parsed));
    if (needsReset) {
      const initial: QuantityState = {};
      inventoryData.forEach((item) => {
        initial[item.id] = item.quantity;
      });
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    return parsed;
  }
  // Initialize from inventory data
  const initial: QuantityState = {};
  inventoryData.forEach((item) => {
    initial[item.id] = item.quantity;
  });
  return initial;
};

const getInitialSelectedCategories = (): SelectedCategoriesState => {
  const stored = sessionStorage.getItem(SELECTED_CATEGORIES_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  return {};
};

export const useInventoryQuantities = () => {
  const [quantities, setQuantities] = useState<QuantityState>(getInitialQuantities);
  const [selectedCategories, setSelectedCategories] = useState<SelectedCategoriesState>(getInitialSelectedCategories);

  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(quantities));
  }, [quantities]);

  useEffect(() => {
    sessionStorage.setItem(SELECTED_CATEGORIES_KEY, JSON.stringify(selectedCategories));
  }, [selectedCategories]);

  const decrementQuantity = (itemId: string, category: InventoryCategory) => {
    setQuantities((prev) => ({
      ...prev,
      [itemId]: Math.max(0, (prev[itemId] || 0) - 1),
    }));

    // Track selection for single-select categories
    if (SINGLE_SELECT_CATEGORIES.includes(category)) {
      setSelectedCategories((prev) => ({
        ...prev,
        [category]: itemId,
      }));
    }
  };

  const incrementQuantity = (itemId: string, category: InventoryCategory) => {
    const item = inventoryData.find(i => i.id === itemId);
    if (!item) return;

    setQuantities((prev) => ({
      ...prev,
      [itemId]: Math.min(item.quantity, (prev[itemId] || 0) + 1),
    }));

    // Check if quantity is now back to original, clear selection for single-select categories
    if (SINGLE_SELECT_CATEGORIES.includes(category)) {
      const newQuantity = Math.min(item.quantity, (quantities[itemId] || 0) + 1);
      if (newQuantity === item.quantity) {
        setSelectedCategories((prev) => {
          const updated = { ...prev };
          if (updated[category] === itemId) {
            delete updated[category];
          }
          return updated;
        });
      }
    }
  };

  const unselectItem = (itemId: string, category: InventoryCategory) => {
    const item = inventoryData.find(i => i.id === itemId);
    if (!item) return;

    // Restore quantity back to original
    setQuantities((prev) => ({
      ...prev,
      [itemId]: item.quantity,
    }));

    // Clear category selection if this was the selected item
    if (SINGLE_SELECT_CATEGORIES.includes(category)) {
      setSelectedCategories((prev) => {
        const updated = { ...prev };
        if (updated[category] === itemId) {
          delete updated[category];
        }
        return updated;
      });
    }
  };

  const resetQuantities = () => {
    const initial: QuantityState = {};
    inventoryData.forEach((item) => {
      initial[item.id] = item.quantity;
    });
    setQuantities(initial);
    setSelectedCategories({});
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    sessionStorage.setItem(SELECTED_CATEGORIES_KEY, JSON.stringify({}));
  };

  const getAvailableQuantity = (itemId: string): number => {
    return quantities[itemId] ?? 0;
  };

  const isItemSelected = (itemId: string): boolean => {
    const item = inventoryData.find(i => i.id === itemId);
    if (!item) return false;
    return quantities[itemId] < item.quantity;
  };

  const isCategoryLocked = (category: InventoryCategory, itemId: string): boolean => {
    if (!SINGLE_SELECT_CATEGORIES.includes(category)) {
      return false;
    }
    const selectedItemId = selectedCategories[category];
    // Category is locked for this item if another item in the same category is already selected
    return selectedItemId !== null && selectedItemId !== undefined && selectedItemId !== itemId;
  };

  const getCategoryLockMessage = (category: InventoryCategory): string => {
    return `Only 1 ${category.toLowerCase().slice(0, -1)} can be selected`;
  };

  return {
    quantities,
    selectedCategories,
    decrementQuantity,
    incrementQuantity,
    unselectItem,
    resetQuantities,
    getAvailableQuantity,
    isItemSelected,
    isCategoryLocked,
    getCategoryLockMessage,
  };
};
