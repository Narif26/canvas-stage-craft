import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Download, Calendar, ArrowLeft, PenLine } from "lucide-react";
import { toast } from "sonner";
import { useAiResults } from "@/contexts/AiResultsContext";

const Export = () => {
  const navigate = useNavigate();
  const { aiImages } = useAiResults();

  useEffect(() => {
    if (aiImages.length === 0) {
      toast.error("No AI generated layouts found");
      navigate("/canvas");
    }
  }, [aiImages, navigate]);

  const handleDownload = (imageUrl: string, index: number) => {
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = `ai-layout-${index + 1}-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Downloaded layout ${index + 1}`);
  };

  if (aiImages.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-start justify-between mb-8">
            <div>
              <Button
                variant="ghost"
                onClick={() => navigate("/ai-results")}
                className="mb-4"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to AI Results
              </Button>
              <h1 className="text-4xl font-bold mb-2">Your AI Generated Layouts</h1>
              <p className="text-muted-foreground">
                Download your layouts and proceed to booking
              </p>
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

          {/* AI Generated Images */}
          <div className="space-y-6 mb-8">
            {aiImages.map((image, index) => (
              <div key={index} className="bg-card border rounded-xl p-6 shadow-lg">
                <div className="flex justify-end mb-4">
                  <Button
                    variant="outline"
                    onClick={() => handleDownload(image, index)}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download PNG
                  </Button>
                </div>
                <img
                  src={image}
                  alt={`AI Generated Layout ${index + 1}`}
                  className="w-full rounded-lg shadow-md"
                />
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex justify-center">
            <Button
              size="lg"
              onClick={() => navigate("/booking")}
              className="shadow-lg"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Proceed to Booking
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Export;
