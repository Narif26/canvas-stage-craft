import { useEffect, useRef, useState } from "react";
import { Stage, Layer, Image as KonvaImage, Transformer, Rect } from "react-konva";
import Konva from "konva";
import useImage from "use-image";
import { InventoryCategory } from "@/data/inventory";

export interface CanvasItem {
  canvasId: string;
  name: string;
  image: string;
  category: InventoryCategory;
  x: number;
  y: number;
  scale?: number;
  scaleX?: number;
  scaleY?: number;
  rotation: number;
  zIndex: number;
}

// Maps categories to base layer priority
const getLayerPriority = (category: InventoryCategory): number => {
  switch (category) {
    case "Drapes": return 0;           // Bottom
    case "Backdrops": return 100;      // 2nd layer
    case "Flooring/Rugs": return 150;  // Floor level
    case "Sofas":
    case "Chairs":
    case "Accessories":
    case "Stands":
    case "Lighting":
    case "Pillows": return 200;        // Middle layer
    case "Flowers": return 300;        // Top layer
    default: return 200;
  }
};

interface CanvasImageProps {
  item: CanvasItem;
  isSelected: boolean;
  onSelect: () => void;
  onChange: (newAttrs: Partial<CanvasItem>) => void;
  onContextMenu: (e: Konva.KonvaEventObject<PointerEvent>) => void;
}

const CanvasImageComponent = ({ item, isSelected, onSelect, onChange, onContextMenu }: CanvasImageProps) => {
  const [image] = useImage(item.image, "anonymous");
  const imageRef = useRef<Konva.Image>(null);
  const trRef = useRef<Konva.Transformer>(null);

  useEffect(() => {
    if (isSelected && trRef.current && imageRef.current) {
      trRef.current.nodes([imageRef.current]);
      trRef.current.getLayer()?.batchDraw();
    }
  }, [isSelected]);

  return (
    <>
      <KonvaImage
        ref={imageRef}
        image={image}
        x={item.x}
        y={item.y}
        scaleX={item.scaleX ?? item.scale ?? 1}
        scaleY={item.scaleY ?? item.scale ?? 1}
        rotation={item.rotation}
        width={150}
        height={150}
        draggable
        onClick={onSelect}
        onTap={onSelect}
        onContextMenu={onContextMenu}
        onDragEnd={(e) => {
          onChange({
            x: e.target.x(),
            y: e.target.y(),
          });
        }}
        onTransformEnd={() => {
          const node = imageRef.current;
          if (node) {
            const scaleX = node.scaleX();
            const scaleY = node.scaleY();
            onChange({
              scaleX: scaleX,
              scaleY: scaleY,
              rotation: node.rotation(),
            });
          }
        }}
      />
      {isSelected && (
        <Transformer
          ref={trRef}
          keepRatio={false}
          enabledAnchors={['top-left', 'top-right', 'bottom-left', 'bottom-right', 'middle-left', 'middle-right', 'top-center', 'bottom-center']}
          boundBoxFunc={(oldBox, newBox) => {
            if (newBox.width < 30 || newBox.height < 30) {
              return oldBox;
            }
            return newBox;
          }}
        />
      )}
    </>
  );
};

interface ContextMenuState {
  visible: boolean;
  x: number;
  y: number;
  itemId: string;
}

interface CanvasEditorProps {
  items: CanvasItem[];
  onItemsChange: (items: CanvasItem[]) => void;
  onLayerChange: (id: string, direction: 'up' | 'down' | 'front' | 'back') => void;
  stageRef: React.RefObject<Konva.Stage>;
}

export const CanvasEditor = ({ items, onItemsChange, onLayerChange, stageRef }: CanvasEditorProps) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sort items by layer priority + zIndex for rendering
  const sortedItems = [...items].sort((a, b) => {
    const priorityA = getLayerPriority(a.category) + a.zIndex;
    const priorityB = getLayerPriority(b.category) + b.zIndex;
    return priorityA - priorityB; // Lower values render first (behind)
  });

  const handleSelect = (id: string) => {
    setSelectedId(id);
    setContextMenu(null);
  };

  const handleChange = (id: string, newAttrs: Partial<CanvasItem>) => {
    const newItems = items.map((item) =>
      item.canvasId === id ? { ...item, ...newAttrs } : item
    );
    onItemsChange(newItems);
  };

  const handleContextMenu = (e: Konva.KonvaEventObject<PointerEvent>, itemId: string) => {
    e.evt.preventDefault();
    const containerRect = containerRef.current?.getBoundingClientRect();
    if (containerRect) {
      setContextMenu({
        visible: true,
        x: e.evt.clientX - containerRect.left,
        y: e.evt.clientY - containerRect.top,
        itemId,
      });
      setSelectedId(itemId);
    }
  };

  const handleLayerAction = (direction: 'up' | 'down' | 'front' | 'back') => {
    if (contextMenu) {
      onLayerChange(contextMenu.itemId, direction);
      setContextMenu(null);
    }
  };

  const checkDeselect = (e: Konva.KonvaEventObject<MouseEvent | TouchEvent>) => {
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      setSelectedId(null);
      setContextMenu(null);
    }
  };

  // Close context menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (contextMenu && containerRef.current) {
        const target = e.target as HTMLElement;
        if (!target.closest('.context-menu')) {
          setContextMenu(null);
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [contextMenu]);

  return (
    <div ref={containerRef} className="relative border-2 border-border rounded-xl overflow-hidden shadow-xl bg-gradient-to-br from-muted/20 to-muted/50">
      <Stage
        ref={stageRef}
        width={1200}
        height={800}
        onMouseDown={checkDeselect}
        onTouchStart={checkDeselect}
        className="bg-white"
      >
        <Layer>
          <Rect x={0} y={0} width={1200} height={800} fill="#ffffff" listening={false} />
          {sortedItems.map((item) => (
            <CanvasImageComponent
              key={item.canvasId}
              item={item}
              isSelected={item.canvasId === selectedId}
              onSelect={() => handleSelect(item.canvasId)}
              onChange={(newAttrs) => handleChange(item.canvasId, newAttrs)}
              onContextMenu={(e) => handleContextMenu(e, item.canvasId)}
            />
          ))}
        </Layer>
      </Stage>

      {/* Context Menu */}
      {contextMenu?.visible && (
        <div
          className="context-menu absolute z-50 bg-popover border border-border rounded-lg shadow-lg py-1 min-w-[160px]"
          style={{ left: contextMenu.x, top: contextMenu.y }}
        >
          <button
            className="w-full px-4 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground transition-colors"
            onClick={() => handleLayerAction('front')}
          >
            Bring to Front
          </button>
          <button
            className="w-full px-4 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground transition-colors"
            onClick={() => handleLayerAction('up')}
          >
            Bring Forward
          </button>
          <button
            className="w-full px-4 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground transition-colors"
            onClick={() => handleLayerAction('down')}
          >
            Send Backward
          </button>
          <button
            className="w-full px-4 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground transition-colors"
            onClick={() => handleLayerAction('back')}
          >
            Send to Back
          </button>
        </div>
      )}
    </div>
  );
};
