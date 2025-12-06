import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAiResults } from "@/contexts/AiResultsContext";
import { ArrowLeft, Sparkles, PenLine } from "lucide-react";

const AiResults = () => {
  const navigate = useNavigate();
  const { aiImages, clearAiImages } = useAiResults();
  const [touchupTexts, setTouchupTexts] = useState<Record<number, string>>({});

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
                <h1 className="text-4xl font-bold">AI Generated Layouts</h1>
                <p className="text-muted-foreground mt-1">
                  {aiImages.length} variation{aiImages.length > 1 ? "s" : ""} generated based on your design
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
        {/* Results Grid */}
        <div
          className={`grid gap-6 ${
            aiImages.length === 1
              ? "grid-cols-1 max-w-2xl mx-auto"
              : aiImages.length === 2
              ? "grid-cols-1 md:grid-cols-2"
              : "grid-cols-1 md:grid-cols-2"
          }`}
        >
          {aiImages.map((image, index) => (
            <div
              key={index}
              className="bg-card border border-border rounded-xl overflow-hidden shadow-lg"
            >
              <div className="aspect-[4/3] relative overflow-hidden bg-muted">
                <img
                  src={image}
                  alt={`AI Generated Layout ${index + 1}`}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="p-4">
                <Textarea
                  placeholder="Describe any touchups or changes you'd like to make to this layout..."
                  value={touchupTexts[index] || ""}
                  onChange={(e) => setTouchupTexts(prev => ({ ...prev, [index]: e.target.value }))}
                  className="resize-none"
                  rows={3}
                />
              </div>
            </div>
          ))}
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
