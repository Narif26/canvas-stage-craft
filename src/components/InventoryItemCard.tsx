import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import { InventoryItem } from "@/data/inventory";

interface InventoryItemCardProps {
  item: InventoryItem;
  availableQuantity: number;
  onAddToCanvas: (item: InventoryItem) => void;
}

export const InventoryItemCard = ({ item, availableQuantity, onAddToCanvas }: InventoryItemCardProps) => {
  const isOutOfStock = availableQuantity <= 0;

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden border-2 hover:border-accent/50">
      <CardContent className="p-0">
        <div className="relative aspect-square overflow-hidden bg-muted">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
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
            disabled={isOutOfStock}
          >
            <Plus className="w-4 h-4 mr-2" />
            {isOutOfStock ? "Out of Stock" : "Add to Canvas"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
