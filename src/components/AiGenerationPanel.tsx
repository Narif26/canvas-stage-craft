import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sparkles, Loader2 } from "lucide-react";

interface AiGenerationPanelProps {
  onGenerate: (prompt: string, variations: number) => void;
  isGenerating: boolean;
  hasItems: boolean;
}

export const AiGenerationPanel = ({
  onGenerate,
  isGenerating,
  hasItems,
}: AiGenerationPanelProps) => {
  const [prompt, setPrompt] = useState("");
  const [variations, setVariations] = useState("2");

  const handleGenerate = () => {
    onGenerate(prompt, parseInt(variations));
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6 shadow-lg">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-primary" />
        <h3 className="font-semibold text-lg">AI Generation</h3>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="vibe">Describe the vibe (optional)</Label>
          <Textarea
            id="vibe"
            placeholder="e.g., Romantic garden wedding, Modern corporate event, Rustic bohemian celebration..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={isGenerating}
            className="min-h-[80px] resize-none"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="variations">Number of variations</Label>
          <Select
            value={variations}
            onValueChange={setVariations}
            disabled={isGenerating}
          >
            <SelectTrigger id="variations">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 variation</SelectItem>
              <SelectItem value="2">2 variations</SelectItem>
              <SelectItem value="3">3 variations</SelectItem>
              <SelectItem value="4">4 variations</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          onClick={handleGenerate}
          disabled={isGenerating || !hasItems}
          className="w-full"
          size="lg"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Generating AI layouts...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Generate with AI
            </>
          )}
        </Button>

        {!hasItems && (
          <p className="text-sm text-muted-foreground text-center">
            Add items to the canvas first
          </p>
        )}
      </div>
    </div>
  );
};
