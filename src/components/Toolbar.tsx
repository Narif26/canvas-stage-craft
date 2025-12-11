import { Button } from "@/components/ui/button";
import { Undo, Redo, Trash2, FileJson } from "lucide-react";

interface ToolbarProps {
  onUndo: () => void;
  onRedo: () => void;
  onClear: () => void;
  onExportSizes: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

export const Toolbar = ({ onUndo, onRedo, onClear, onExportSizes, canUndo, canRedo }: ToolbarProps) => {
  return (
    <div className="flex items-center gap-2 p-4 bg-card border rounded-xl shadow-sm">
      <Button
        variant="outline"
        size="sm"
        onClick={onUndo}
        disabled={!canUndo}
      >
        <Undo className="w-4 h-4 mr-2" />
        Undo
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={onRedo}
        disabled={!canRedo}
      >
        <Redo className="w-4 h-4 mr-2" />
        Redo
      </Button>
      
      <div className="w-px h-6 bg-border mx-2" />
      
      <Button
        variant="outline"
        size="sm"
        onClick={onClear}
      >
        <Trash2 className="w-4 h-4 mr-2" />
        Clear All
      </Button>

      <div className="w-px h-6 bg-border mx-2" />
      
      <Button
        variant="default"
        size="sm"
        onClick={onExportSizes}
        className="bg-orange-500 hover:bg-orange-600 text-white"
      >
        <FileJson className="w-4 h-4 mr-2" />
        Export Sizes (Temp)
      </Button>
    </div>
  );
};
