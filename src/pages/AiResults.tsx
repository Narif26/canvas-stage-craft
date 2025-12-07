import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAiResults } from "@/contexts/AiResultsContext";
import { ArrowLeft, Sparkles, PenLine } from "lucide-react";

const AiResults = () => {
  const navigate = useNavigate();
  const { aiImages, clearAiImages } = useAiResults();
  const [touchupText, setTouchupText] = useState("");

  useEffect(() => {
    if (aiImages.length === 0) {
      navigate("/canvas");
    }
  }, [aiImages, navigate]);

  const handleBackToCanvas = () => {
    clearAiImages();
    navigate("/canvas");
  };

  if (aiImages.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <Button
              variant="ghost"
              onClick={handleBackToCanvas}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Canvas
            </Button>
            <div className="flex items-center gap-3">
              <Sparkles className="w-8 h-8 text-primary" />
              <div>
                <h1 className="text-4xl font-bold">AI Generated Layout</h1>
                <p className="text-muted-foreground mt-1">
                  Your design generated based on your layout
                </p>
              </div>
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
              <img
                src={aiImages[0]}
                alt="AI Generated Layout"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="p-4">
              <Textarea
                placeholder="Describe any touchups or changes you'd like to make to this layout..."
                value={touchupText}
                onChange={(e) => setTouchupText(e.target.value)}
                className="resize-none"
                rows={3}
              />
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
