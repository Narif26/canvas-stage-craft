import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Lock } from "lucide-react";
import { InventoryItem } from "@/data/inventory";

interface InventoryItemCardProps {
  item: InventoryItem;
  availableQuantity: number;
  isCategoryLocked: boolean;
  lockMessage?: string;
  onAddToCanvas: (item: InventoryItem) => void;
}

export const InventoryItemCard = ({ 
  item, 
  availableQuantity, 
  isCategoryLocked,
  lockMessage,
  onAddToCanvas 
}: InventoryItemCardProps) => {
  const isOutOfStock = availableQuantity <= 0;
  const isDisabled = isOutOfStock || isCategoryLocked;

  return (
    <Card className={`group transition-all duration-300 overflow-hidden border-2 ${
      isCategoryLocked 
        ? 'opacity-60 border-muted' 
        : 'hover:shadow-lg hover:border-accent/50'
    }`}>
      <CardContent className="p-0">
        <div className={`relative aspect-square overflow-hidden bg-muted ${isCategoryLocked ? 'grayscale' : ''}`}>
          <img
            src={item.image}
            alt={item.name}
            className={`w-full h-full object-cover transition-transform duration-300 ${
              !isCategoryLocked ? 'group-hover:scale-105' : ''
            }`}
          />
          <div className={`absolute inset-0 bg-gradient-to-t from-black/60 to-transparent transition-opacity ${
            isCategoryLocked ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
          }`} />
          {isCategoryLocked && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-background/90 px-3 py-2 rounded-lg flex items-center gap-2 text-sm font-medium">
                <Lock className="w-4 h-4" />
                {lockMessage}
              </div>
            </div>
          )}
        </div>
        
        <div className="p-4 space-y-3">
          <div>
            <h3 className="font-semibold text-lg line-clamp-1">{item.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="secondary" className="text-xs">
                {item.category}
              </Badge>
              <span className={`text-sm ${isOutOfStock ? 'text-destructive' : 'text-muted-foreground'}`}>
                Qty: {availableQuantity}
              </span>
            </div>
          </div>
          
          <Button
            onClick={() => onAddToCanvas(item)}
            className="w-full"
            size="sm"
            disabled={isDisabled}
          >
            {isCategoryLocked ? (
              <>
                <Lock className="w-4 h-4 mr-2" />
                Locked
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 mr-2" />
                {isOutOfStock ? "Out of Stock" : "Add to Canvas"}
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
