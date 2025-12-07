import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Sparkles, Loader2 } from "lucide-react";

interface AiGenerationPanelProps {
  onGenerate: (prompt: string) => void;
  isGenerating: boolean;
  hasItems: boolean;
}

export const AiGenerationPanel = ({
  onGenerate,
  isGenerating,
  hasItems,
}: AiGenerationPanelProps) => {
  const [prompt, setPrompt] = useState("");

  const handleGenerate = () => {
    onGenerate(prompt);
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

        <Button
          onClick={handleGenerate}
          disabled={isGenerating || !hasItems}
          className="w-full"
          size="lg"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Generating your design...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Generate your Design
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
