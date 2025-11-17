import { useEffect, useRef, useState } from "react";
import { Stage, Layer, Image as KonvaImage, Transformer } from "react-konva";
import Konva from "konva";
import useImage from "use-image";

interface CanvasItem {
  canvasId: string;
  name: string;
  image: string;
  x: number;
  y: number;
  scale: number;
  rotation: number;
}

interface CanvasImageProps {
  item: CanvasItem;
  isSelected: boolean;
  onSelect: () => void;
  onChange: (newAttrs: Partial<CanvasItem>) => void;
}

const CanvasImageComponent = ({ item, isSelected, onSelect, onChange }: CanvasImageProps) => {
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
        scaleX={item.scale}
        scaleY={item.scale}
        rotation={item.rotation}
        width={150}
        height={150}
        draggable
        onClick={onSelect}
        onTap={onSelect}
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
            onChange({
              scale: scaleX,
              rotation: node.rotation(),
            });
          }
        }}
      />
      {isSelected && (
        <Transformer
          ref={trRef}
          keepRatio
          boundBoxFunc={(oldBox, newBox) => {
            if (newBox.width < 50 || newBox.height < 50) {
              return oldBox;
            }
            return newBox;
          }}
        />
      )}
    </>
  );
};

interface CanvasEditorProps {
  items: CanvasItem[];
  onItemsChange: (items: CanvasItem[]) => void;
  stageRef: React.RefObject<Konva.Stage>;
}

export const CanvasEditor = ({ items, onItemsChange, stageRef }: CanvasEditorProps) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleSelect = (id: string) => {
    setSelectedId(id);
  };

  const handleChange = (id: string, newAttrs: Partial<CanvasItem>) => {
    const newItems = items.map((item) =>
      item.canvasId === id ? { ...item, ...newAttrs } : item
    );
    onItemsChange(newItems);
  };

  const checkDeselect = (e: Konva.KonvaEventObject<MouseEvent | TouchEvent>) => {
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      setSelectedId(null);
    }
  };

  return (
    <div className="border-2 border-border rounded-xl overflow-hidden shadow-xl bg-gradient-to-br from-muted/20 to-muted/50">
      <Stage
        ref={stageRef}
        width={1200}
        height={800}
        onMouseDown={checkDeselect}
        onTouchStart={checkDeselect}
        className="bg-white"
      >
        <Layer>
          {items.map((item) => (
            <CanvasImageComponent
              key={item.canvasId}
              item={item}
              isSelected={item.canvasId === selectedId}
              onSelect={() => handleSelect(item.canvasId)}
              onChange={(newAttrs) => handleChange(item.canvasId, newAttrs)}
            />
          ))}
        </Layer>
      </Stage>
    </div>
  );
};
