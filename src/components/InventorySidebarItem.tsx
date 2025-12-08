import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Lock, X } from "lucide-react";
import { InventoryItem } from "@/data/inventory";

interface InventorySidebarItemProps {
  item: InventoryItem;
  availableQuantity: number;
  isCategoryLocked: boolean;
  isSelected: boolean;
  lockMessage?: string;
  onAddToCanvas: (item: InventoryItem) => void;
  onUnselect: (item: InventoryItem) => void;
}

export const InventorySidebarItem = ({
  item,
  availableQuantity,
  isCategoryLocked,
  isSelected,
  lockMessage,
  onAddToCanvas,
  onUnselect,
}: InventorySidebarItemProps) => {
  const isOutOfStock = availableQuantity <= 0;
  const isDisabled = isOutOfStock || isCategoryLocked;
  const isFlower = item.category === "Flowers";

  return (
    <div
      className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
        isCategoryLocked
          ? "opacity-60 bg-muted/50"
          : isSelected
          ? "border-primary bg-primary/5"
          : "hover:bg-muted/50 border-border"
      }`}
    >
      {/* Thumbnail */}
      <div
        className={`w-16 h-16 rounded-md overflow-hidden bg-muted shrink-0 ${
          isCategoryLocked ? "grayscale" : ""
        }`}
      >
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-sm truncate">{item.name}</h4>
        <div className="flex items-center gap-2 mt-1">
          <Badge variant="secondary" className="text-xs">
            {item.category}
          </Badge>
          {!isFlower && (
            <span
              className={`text-xs ${
                isOutOfStock ? "text-destructive" : "text-muted-foreground"
              }`}
            >
              Qty: {availableQuantity}
            </span>
          )}
        </div>
        {isCategoryLocked && lockMessage && (
          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
            <Lock className="w-3 h-3" />
            {lockMessage}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-1 shrink-0">
        {isSelected && !isCategoryLocked && (
          <Button
            onClick={() => onUnselect(item)}
            size="icon"
            variant="ghost"
            className="h-8 w-8"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
        <Button
          onClick={() => onAddToCanvas(item)}
          size="icon"
          variant={isDisabled ? "ghost" : "default"}
          className="h-8 w-8"
          disabled={isDisabled}
        >
          {isCategoryLocked ? (
            <Lock className="w-4 h-4" />
          ) : (
            <Plus className="w-4 h-4" />
          )}
        </Button>
      </div>
    </div>
  );
};
