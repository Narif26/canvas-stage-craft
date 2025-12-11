import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAiResults } from "@/contexts/AiResultsContext";
import { Sparkles, PenLine, Loader2 } from "lucide-react";
import { generateTouchup } from "@/utils/generateLayoutApi";
import { useToast } from "@/hooks/use-toast";

const AiResults = () => {
  const navigate = useNavigate();
  const { aiImages, setAiImages, clearAiImages } = useAiResults();
  const [touchupText, setTouchupText] = useState("");
  const [isTouchingUp, setIsTouchingUp] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (aiImages.length === 0) {
      navigate("/canvas");
    }
  }, [aiImages, navigate]);

  const handleBackToCanvas = () => {
    clearAiImages();
    navigate("/canvas");
  };

  const handleTouchup = async () => {
    if (!touchupText.trim() || !aiImages[0]) return;

    setIsTouchingUp(true);
    try {
      // Extract base64 from data URL (remove "data:image/...;base64," prefix)
      const base64Match = aiImages[0].match(/^data:image\/[^;]+;base64,(.+)$/);
      if (!base64Match) {
        throw new Error("Invalid image format");
      }
      const imageBase64 = base64Match[1];

      const result = await generateTouchup({
        imageBase64,
        touchupChanges: touchupText.trim(),
      });

      if (result.images && result.images.length > 0) {
        setAiImages(result.images);
        setTouchupText("");
        toast({
          title: "Touchup applied",
          description: "Your design has been updated with the requested changes.",
        });
      } else {
        throw new Error("No image returned from touchup");
      }
    } catch (error) {
      console.error("Touchup error:", error);
      toast({
        title: "Touchup failed",
        description: error instanceof Error ? error.message : "Failed to apply touchup",
        variant: "destructive",
      });
    } finally {
      setIsTouchingUp(false);
    }
  };

  if (aiImages.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div className="flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-4xl font-bold">AI Generated Layout</h1>
              <p className="text-muted-foreground mt-1">
                Your design generated based on your layout
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={() => navigate("/canvas")}
            className="shrink-0"
          >
            <PenLine className="w-4 h-4 mr-2" />
            Return to Canvas
          </Button>
        </div>

        {/* Result */}
        <div className="max-w-3xl mx-auto">
          <div className="bg-card border border-border rounded-xl overflow-hidden shadow-lg">
            <div className="aspect-[4/3] relative overflow-hidden bg-muted">
              {isTouchingUp && (
                <div className="absolute inset-0 bg-background/80 flex items-center justify-center z-10">
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    <p className="text-sm text-muted-foreground">Applying touchups...</p>
                  </div>
                </div>
              )}
              <img
                src={aiImages[0]}
                alt="AI Generated Layout"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="p-4 flex gap-2 items-start">
              <Textarea
                placeholder="Describe any touchups or changes you'd like to make to this layout..."
                value={touchupText}
                onChange={(e) => setTouchupText(e.target.value)}
                className="resize-none flex-1"
                rows={3}
                disabled={isTouchingUp}
              />
              <Button
                onClick={handleTouchup}
                disabled={!touchupText.trim() || isTouchingUp}
                className="shrink-0"
              >
                {isTouchingUp ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex justify-center gap-4">
          <Button variant="outline" onClick={handleBackToCanvas}>
            Edit Canvas & Regenerate
          </Button>
          <Button onClick={() => navigate("/export")}>
            Proceed to Export
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AiResults;
